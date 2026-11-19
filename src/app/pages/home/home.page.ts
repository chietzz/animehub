import { UpperCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonRouterLink,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { finalize, forkJoin } from 'rxjs';

import { AnimeCardComponent } from '../../components/anime-card/anime-card.component';
import { CardEsqueletoComponent } from '../../components/card-esqueleto/card-esqueleto.component';
import { EstadoComponent } from '../../components/estado/estado.component';
import { FavoriteButtonDirective } from '../../directives/favorite-button.directive';
import { HighlightScoreDirective } from '../../directives/highlight-score.directive';
import { Anime } from '../../models/anime.model';
import { ScorePipe } from '../../pipes/score.pipe';
import { SynopsisPipe } from '../../pipes/synopsis.pipe';
import { AnimeService } from '../../services/anime.service';
import { FavoritesService } from '../../services/favorites.service';
import { escolherImagem, nomeDoAnime, trocarPorImagemPadrao } from '../../utils/anime-helpers';
import { traduzirTipo } from '../../utils/traducoes';

/** PÁGINA 1 — Home: destaque, atalhos e as listas de animes populares e mais bem avaliados. */
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonIcon,
    IonRouterLink,
    IonSkeletonText,
    RouterLink,
    UpperCasePipe,
    ScorePipe,
    SynopsisPipe,
    HighlightScoreDirective,
    FavoriteButtonDirective,
    AnimeCardComponent,
    CardEsqueletoComponent,
    EstadoComponent,
  ],
})
export class HomePage implements OnInit {
  private readonly animeService = inject(AnimeService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  populares: Anime[] = [];
  melhores: Anime[] = [];
  destaque: Anime | null = null;
  carregando = true;
  erro = '';
  readonly esqueletos = [1, 2, 3, 4, 5, 6];

  ngOnInit(): void {
    this.carregar();
  }

  /** Busca as duas listas na API (as duas consultas saem ao mesmo tempo). */
  carregar(): void {
    this.carregando = true;
    this.erro = '';

    forkJoin({
      populares: this.animeService.getTopAnime({ filtro: 'bypopularity', limite: 12 }),
      melhores: this.animeService.getTopAnime({ limite: 12 }),
    })
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: ({ populares, melhores }) => {
          this.populares = populares.data;
          this.melhores = melhores.data;
          this.destaque = this.escolherDestaque(melhores.data);
        },
        error: (erro: Error) => (this.erro = erro.message),
      });
  }

  /** Sorteia o destaque entre os 5 primeiros mais bem avaliados que têm sinopse e imagem grande. */
  private escolherDestaque(lista: Anime[]): Anime | null {
    const candidatos = lista.filter((a) => a.synopsis && a.images?.jpg?.large_image_url).slice(0, 5);
    if (candidatos.length === 0) {
      return lista[0] ?? null;
    }
    return candidatos[Math.floor(Math.random() * candidatos.length)];
  }

  /** Vai para a página de Detalhes enviando o ID do anime na rota (ex.: /detalhes/21). */
  abrirDetalhes(id: number): void {
    this.router.navigate(['/detalhes', id]);
  }

  // ---- Favoritos ----
  get totalFavoritos(): number {
    return this.favoritesService.getFavorites().length;
  }

  isFavorito(id: number): boolean {
    return this.favoritesService.isFavorite(id);
  }

  alternarFavorito(anime: Anime): void {
    this.favoritesService.toggleFavorite(anime);
  }

  // ---- Dados do destaque para o template ----
  get nomeDestaque(): string {
    return this.destaque ? nomeDoAnime(this.destaque) : '';
  }

  get imagemDestaque(): string {
    return this.destaque ? escolherImagem(this.destaque) : '';
  }

  get tipoDestaque(): string {
    return traduzirTipo(this.destaque?.type);
  }

  aoFalharImagem(evento: Event): void {
    trocarPorImagemPadrao(evento);
  }
}
