import { Component } from '@angular/core';
import { IonSkeletonText } from '@ionic/angular/standalone';

/** "Cartão fantasma" mostrado enquanto os animes carregam. */
@Component({
  selector: 'app-card-esqueleto',
  standalone: true,
  imports: [IonSkeletonText],
  templateUrl: './card-esqueleto.component.html',
  styleUrl: './card-esqueleto.component.scss',
})
export class CardEsqueletoComponent {}
