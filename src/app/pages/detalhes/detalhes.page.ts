import { DatePipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { finalize } from 'rxjs';

import { EstadoComponent } from '../../components/estado/estado.component';
import { FavoriteButtonDirective } from '../../directives/favorite-button.directive';
import { HighlightScoreDirective } from '../../directives/highlight-score.directive';
import { Anime } from '../../models/anime.model';
import { ScorePipe } from '../../pipes/score.pipe';
import { SynopsisPipe } from '../../pipes/synopsis.pipe';
import { AnimeService } from '../../services/anime.service';
import { FavoritesService } from '../../services/favorites.service';
import {
  IMAGEM_PADRAO,
  escolherImagem,
  limparSinopse,
  nomeDoAnime,
  trocarPorImagemPadrao,
} from '../../utils/anime-helpers';
import { traduzirDuracao, traduzirGenero, traduzirStatus, traduzirTipo } from '../../utils/traducoes';

/** PÁGINA 3 — Detalhes: recebe o ID do anime pela rota (/detalhes/:id) e consulta a API. */
@Component({
  selector: 'app-detalhes',
  standalone: true,
  templateUrl: './detalhes.page.html',
  styleUrl: './detalhes.page.scss',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    IonChip,
    IonIcon,
    IonSkeletonText,
    RouterLink,
    DatePipe,
    UpperCasePipe,
    ScorePipe,
    SynopsisPipe,
    HighlightScoreDirective,
    FavoriteButtonDirective,
    EstadoComponent,
  ],
})
export class DetalhesPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly animeService = inject(AnimeService);
  private readonly favoritesService = inject(FavoritesService);

  /** Quantos caracteres da sinopse aparecem antes de "Ler sinopse completa". */
  readonly limiteSinopse = 380;

  anime: Anime | null = null;
  generos: { id: number; nome: string }[] = [];
  carregando = true;
  erro = '';
  sinopseCompleta = false;
  private idDoAnime = 0;

  ngOnInit(): void {
    // PARÂMETRO DE ROTA: na URL /detalhes/21, o "21" chega aqui como params.get('id').
    this.route.paramMap.subscribe((params) => {
      this.idDoAnime = Number(params.get('id'));
      this.carregar();
    });
  }

  /** Usa o ID recebido pela rota para buscar os detalhes na API. */
  carregar(): void {
    this.anime = null;
    this.erro = '';
    this.sinopseCompleta = false;

    if (!Number.isInteger(this.idDoAnime) || this.idDoAnime <= 0) {
      this.carregando = false;
      this.erro = 'Este endereço não é válido. Escolha um anime pelo catálogo.';
      return;
    }

    this.carregando = true;
    this.animeService
      .getAnimeDetails(this.idDoAnime)
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (resposta) => {
          this.anime = resposta.data;
          this.generos = (resposta.data.genres ?? []).map((g) => ({ id: g.mal_id, nome: traduzirGenero(g.name) }));
        },
        error: (erro: Error) => (this.erro = erro.message),
      });
  }

  // ---- Favoritos ----
  get favorito(): boolean {
    return this.anime ? this.favoritesService.isFavorite(this.anime.mal_id) : false;
  }

  alternarFavorito(): void {
    if (this.anime) {
      this.favoritesService.toggleFavorite(this.anime);
    }
  }

  // ---- Sinopse ----
  get precisaDeLerMais(): boolean {
    return limparSinopse(this.anime?.synopsis).length > this.limiteSinopse;
  }

  get limiteAtual(): number {
    return this.sinopseCompleta ? 100000 : this.limiteSinopse;
  }

  alternarSinopse(): void {
    this.sinopseCompleta = !this.sinopseCompleta;
  }

  // ---- Dados prontos para o template (tratam informações que a API não enviou) ----
  get nome(): string {
    return this.anime ? nomeDoAnime(this.anime) : '';
  }

  get nomeOriginal(): string | null {
    if (!this.anime) {
      return null;
    }
    return this.anime.title_japanese || (this.anime.title !== this.nome ? this.anime.title : null);
  }

  get imagem(): string {
    return this.anime ? escolherImagem(this.anime) : IMAGEM_PADRAO;
  }

  get tipo(): string {
    return traduzirTipo(this.anime?.type);
  }

  get status(): string {
    return traduzirStatus(this.anime?.status);
  }

  get duracao(): string {
    return traduzirDuracao(this.anime?.duration);
  }

  aoFalharImagem(evento: Event): void {
    trocarPorImagemPadrao(evento);
  }
}
