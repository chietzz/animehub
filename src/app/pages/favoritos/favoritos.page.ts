import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { EstadoComponent } from '../../components/estado/estado.component';
import { FavoriteButtonDirective } from '../../directives/favorite-button.directive';
import { HighlightScoreDirective } from '../../directives/highlight-score.directive';
import { AnimeResumo } from '../../models/anime.model';
import { ScorePipe } from '../../pipes/score.pipe';
import { SynopsisPipe } from '../../pipes/synopsis.pipe';
import { FavoritesService } from '../../services/favorites.service';
import { escolherImagem, nomeDoAnime, trocarPorImagemPadrao } from '../../utils/anime-helpers';

/** PÁGINA 4 — Favoritos: lista os animes salvos no localStorage (não usa a API). */
@Component({
  selector: 'app-favoritos',
  standalone: true,
  templateUrl: './favoritos.page.html',
  styleUrl: './favoritos.page.scss',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    RouterLink,
    ScorePipe,
    SynopsisPipe,
    HighlightScoreDirective,
    FavoriteButtonDirective,
    EstadoComponent,
  ],
})
export class FavoritosPage {
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  /** A lista vem do FavoritesService; quando ela muda, a tela atualiza sozinha. */
  get favoritos(): AnimeResumo[] {
    return this.favoritesService.getFavorites();
  }

  remover(id: number): void {
    this.favoritesService.removeFavorite(id);
  }

  /** Vai para a página de Detalhes enviando o ID do anime na rota (ex.: /detalhes/21). */
  abrirDetalhes(id: number): void {
    this.router.navigate(['/detalhes', id]);
  }

  nome(anime: AnimeResumo): string {
    return nomeDoAnime(anime);
  }

  imagem(anime: AnimeResumo): string {
    return escolherImagem(anime);
  }

  aoFalharImagem(evento: Event): void {
    trocarPorImagemPadrao(evento);
  }
}
