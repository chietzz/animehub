import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Observable, Subscription, finalize } from 'rxjs';

import { AnimeCardComponent } from '../../components/anime-card/anime-card.component';
import { CardEsqueletoComponent } from '../../components/card-esqueleto/card-esqueleto.component';
import { EstadoComponent } from '../../components/estado/estado.component';
import { Anime, GENEROS_CATALOGO, RespostaLista } from '../../models/anime.model';
import { AnimeService } from '../../services/anime.service';

/** PÁGINA 2 — Catálogo: pesquisa por nome, filtro por gênero e lista de animes em cards. */
@Component({
  selector: 'app-catalogo',
  standalone: true,
  templateUrl: './catalogo.page.html',
  styleUrl: './catalogo.page.scss',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSearchbar,
    IonContent,
    IonChip,
    IonButton,
    IonIcon,
    IonSpinner,
    AnimeCardComponent,
    CardEsqueletoComponent,
    EstadoComponent,
  ],
})
export class CatalogoPage implements OnInit {
  private readonly animeService = inject(AnimeService);
  private readonly router = inject(Router);

  /** Chips do filtro: "Todos" (id null) + os gêneros. */
  readonly opcoesGenero: { id: number | null; nome: string }[] = [{ id: null, nome: 'Todos' }, ...GENEROS_CATALOGO];
  readonly esqueletos = Array.from({ length: 12 }, (_, i) => i);

  termo = ''; // o que a pessoa digitou na busca
  generoSelecionado: number | null = null;
  animes: Anime[] = [];
  pagina = 1;
  temMais = false; // existe mais uma página de resultados?
  carregando = false; // carregando a lista do zero
  carregandoMais = false; // carregando a próxima página
  erro = '';
  erroMais = '';

  private requisicao?: Subscription;

  ngOnInit(): void {
    this.buscar();
  }

  // ---- Ações da tela ----

  /** Chamado a cada digitação (o ion-searchbar espera 600 ms para não gastar requisições à toa). */
  aoDigitar(evento: Event): void {
    const valor = ((evento as CustomEvent).detail?.value ?? '') as string;
    this.aplicarTermo(valor.trim());
  }

  aoLimpar(): void {
    this.aplicarTermo('');
  }

  selecionarGenero(id: number | null): void {
    if (id === this.generoSelecionado) {
      return;
    }
    this.generoSelecionado = id;
    this.buscar();
  }

  limparFiltros(campoBusca: IonSearchbar): void {
    campoBusca.value = '';
    this.termo = '';
    this.generoSelecionado = null;
    this.buscar();
  }

  /** Começa uma consulta nova (volta para a página 1). */
  buscar(): void {
    this.pagina = 1;
    this.carregar(false);
  }

  carregarMais(): void {
    if (this.carregandoMais || !this.temMais) {
      return;
    }
    this.pagina++;
    this.carregar(true);
  }

  /** Vai para a página de Detalhes enviando o ID do anime na rota (ex.: /detalhes/21). */
  abrirDetalhes(id: number): void {
    this.router.navigate(['/detalhes', id]);
  }

  // ---- Textos que dependem do estado ----

  get descricao(): string {
    const genero = GENEROS_CATALOGO.find((g) => g.id === this.generoSelecionado)?.nome;
    if (this.termo && genero) {
      return `Resultados para “${this.termo}” em ${genero}`;
    }
    if (this.termo) {
      return `Resultados para “${this.termo}”`;
    }
    if (genero) {
      return `Mais populares em ${genero}`;
    }
    return 'Os animes mais bem avaliados';
  }

  get mensagemVazia(): string {
    return this.termo
      ? `Não encontramos nada para “${this.termo}”. Confira o nome ou troque o gênero.`
      : 'Nenhum anime deste gênero foi encontrado.';
  }

  // ---- Lógica interna ----

  private aplicarTermo(novo: string): void {
    if (novo === this.termo) {
      return;
    }
    this.termo = novo;
    this.buscar();
  }

  private carregar(maisPaginas: boolean): void {
    this.requisicao?.unsubscribe(); // cancela a espera da consulta anterior
    this.erro = '';
    this.erroMais = '';
    this.carregandoMais = maisPaginas;
    this.carregando = !maisPaginas;

    // Sem busca e sem gênero → lista "top"; com busca ou gênero → pesquisa.
    const consulta$: Observable<RespostaLista> =
      this.termo || this.generoSelecionado !== null
        ? this.animeService.searchAnime(this.termo, { genero: this.generoSelecionado ?? undefined, pagina: this.pagina })
        : this.animeService.getTopAnime({ pagina: this.pagina, limite: 24 });

    this.requisicao = consulta$
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.carregandoMais = false;
        }),
      )
      .subscribe({
        next: (resposta) => {
          const jaMostrados = maisPaginas ? this.animes : [];
          this.animes = [...jaMostrados, ...this.semRepetidos(resposta.data, jaMostrados)];
          this.temMais = resposta.pagination?.has_next_page ?? false;
        },
        error: (erro: Error) => {
          if (maisPaginas) {
            this.pagina--; // para poder tentar a mesma página de novo
            this.erroMais = erro.message;
          } else {
            this.animes = [];
            this.temMais = false;
            this.erro = erro.message;
          }
        },
      });
  }

  /** A API às vezes repete um anime entre páginas; aqui garantimos que cada um apareça só uma vez. */
  private semRepetidos(novos: Anime[], existentes: Anime[]): Anime[] {
    const vistos = new Set(existentes.map((a) => a.mal_id));
    return novos.filter((a) => {
      if (vistos.has(a.mal_id)) {
        return false;
      }
      vistos.add(a.mal_id);
      return true;
    });
  }
}
