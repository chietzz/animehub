import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, TimeoutError, catchError, map, retry, shareReplay, tap, throwError, timeout, timer } from 'rxjs';

import { RespostaDetalhe, RespostaLista } from '../models/anime.model';
import { RespostaDetalheKitsu, RespostaListaKitsu, converterDetalheKitsu, converterListaKitsu } from './kitsu-adapter';

export interface OpcoesTop {
  filtro?: 'airing' | 'upcoming' | 'bypopularity' | 'favorite';
  pagina?: number;
  limite?: number;
}
export interface OpcoesBusca {
  genero?: number;
  pagina?: number;
  limite?: number;
}

/** Categorias da Kitsu correspondentes aos códigos de filtro que já existem na tela. */
const CATEGORIAS: Record<number, string> = {
  1: 'action', 2: 'adventure', 4: 'comedy', 8: 'drama', 10: 'fantasy',
  22: 'romance', 24: 'science-fiction', 36: 'slice-of-life', 37: 'supernatural',
  7: 'mystery', 41: 'thriller', 14: 'horror', 30: 'sports',
};

/**
 * Serviço 1: responsável apenas pelo HttpClient / Kitsu API (sem token).
 * Serviço 2: FavoritesService, para favoritos armazenados localmente.
 * Os três métodos públicos usam GET e adaptam JSON:API para o modelo do app.
 */
@Injectable({ providedIn: 'root' })
export class AnimeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://kitsu.io/api/edge';
  private readonly headers = new HttpHeaders({ Accept: 'application/vnd.api+json' });
  private readonly cache = new Map<string, Observable<unknown>>();

  /** GET 1: /anime, ordenado por avaliação ou popularidade. */
  getTopAnime(opcoes: OpcoesTop = {}): Observable<RespostaLista> {
    const pagina = Math.max(1, opcoes.pagina ?? 1);
    const limite = Math.max(1, Math.min(20, opcoes.limite ?? 12)); // máximo Kitsu: 20
    let params = this.paginacao(pagina, limite);
    params = params.set('sort', opcoes.filtro === 'bypopularity' ? '-userCount' : opcoes.filtro === 'favorite' ? '-favoritesCount' : '-averageRating');
    if (opcoes.filtro === 'airing') params = params.set('filter[status]', 'current');
    if (opcoes.filtro === 'upcoming') params = params.set('filter[status]', 'tba');
    return this.get<RespostaListaKitsu>('/anime', params).pipe(
      map((resposta) => converterListaKitsu(resposta, pagina, limite)),
    );
  }

  /** GET 2: /anime?filter[text]=... ou /anime?filter[categories]=... */
  searchAnime(query: string, opcoes: OpcoesBusca = {}): Observable<RespostaLista> {
    const pagina = Math.max(1, opcoes.pagina ?? 1);
    const limite = Math.max(1, Math.min(20, opcoes.limite ?? 24));
    let params = this.paginacao(pagina, limite);
    const texto = query.trim();
    if (texto) {
      params = params.set('filter[text]', texto);
    } else {
      params = params.set('sort', '-userCount');
    }
    const categoria = opcoes.genero ? CATEGORIAS[opcoes.genero] : undefined;
    if (categoria) params = params.set('filter[categories]', categoria);
    return this.get<RespostaListaKitsu>('/anime', params).pipe(
      map((resposta) => converterListaKitsu(resposta, pagina, limite)),
    );
  }

  /** GET 3: /anime/{id}?include=categories: detalhes do anime selecionado. */
  getAnimeDetails(id: number): Observable<RespostaDetalhe> {
    if (!Number.isSafeInteger(id) || id <= 0) {
      return throwError(() => new Error('ID de anime inválido.'));
    }
    return this.get<RespostaDetalheKitsu>(`/anime/${id}`, new HttpParams().set('include', 'categories')).pipe(
      map(converterDetalheKitsu),
    );
  }

  private paginacao(pagina: number, limite: number): HttpParams {
    return new HttpParams()
      .set('page[limit]', limite)
      .set('page[offset]', (pagina - 1) * limite);
  }

  private get<T>(caminho: string, params?: HttpParams): Observable<T> {
    const url = `${this.baseUrl}${caminho}`;
    const chave = `${url}?${params?.toString() ?? ''}`;
    const existente = this.cache.get(chave);
    if (existente) return existente as Observable<T>;

    const requisicao$ = this.http.get<T>(url, { params, headers: this.headers }).pipe(
      timeout({ first: 16000 }),
      retry({
        count: 1,
        delay: (erro: unknown) => {
          if (!(erro instanceof HttpErrorResponse) || (erro.status !== 429 && erro.status < 500)) {
            return throwError(() => erro);
          }
          const valor = Number(erro.headers.get('Retry-After'));
          return timer(erro.status === 429 && Number.isFinite(valor) && valor > 0
            ? Math.min(15000, valor * 1000) : 1500);
        },
      }),
      catchError((erro: unknown) => throwError(() => this.criarErro(erro))),
      tap({ error: () => this.cache.delete(chave) }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.cache.set(chave, requisicao$);
    return requisicao$;
  }

  private criarErro(erro: unknown): Error {
    if (erro instanceof TimeoutError) return new Error('A API demorou para responder. Verifique a rede e tente novamente.');
    if (erro instanceof Error && !(erro instanceof HttpErrorResponse)) return erro;
    if (!(erro instanceof HttpErrorResponse)) return new Error('Falha ao carregar animes.');
    if (erro.status === 0) return new Error('Sem conexão com a Kitsu API. Confira a internet, DNS e bloqueios de rede (CORS).');
    if (erro.status === 404) return new Error('Anime não encontrado na Kitsu.');
    if (erro.status === 429) return new Error('Muitas requisições. Aguarde alguns segundos e tente novamente.');
    if (erro.status >= 500) return new Error('A Kitsu API está temporariamente indisponível.');
    return new Error(`Erro HTTP ${erro.status} ao buscar animes.`);
  }
}
