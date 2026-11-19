import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';

import { HighlightScoreDirective } from '../../directives/highlight-score.directive';
import { AnimeResumo } from '../../models/anime.model';
import { ScorePipe } from '../../pipes/score.pipe';
import { escolherImagem, nomeDoAnime, trocarPorImagemPadrao } from '../../utils/anime-helpers';
import { traduzirTipo } from '../../utils/traducoes';

/**
 * Card de anime (imagem, nome e nota). É usado na Home e no Catálogo.
 * Quando o usuário toca no card, ele AVISA a página pelo evento (abrir) enviando o ID do anime.
 * A página é quem decide para onde navegar.
 */
@Component({
  selector: 'app-anime-card',
  standalone: true,
  imports: [IonCard, IonCardContent, IonIcon, UpperCasePipe, ScorePipe, HighlightScoreDirective],
  templateUrl: './anime-card.component.html',
  styleUrl: './anime-card.component.scss',
})
export class AnimeCardComponent {
  @Input({ required: true }) anime!: AnimeResumo;
  @Output() abrir = new EventEmitter<number>();

  get nome(): string {
    return nomeDoAnime(this.anime);
  }

  get imagem(): string {
    return escolherImagem(this.anime);
  }

  get tipo(): string {
    return traduzirTipo(this.anime.type);
  }

  aoClicar(): void {
    this.abrir.emit(this.anime.mal_id);
  }

  aoFalharImagem(evento: Event): void {
    trocarPorImagemPadrao(evento);
  }
}
