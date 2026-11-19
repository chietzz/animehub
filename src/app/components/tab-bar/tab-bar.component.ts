import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon, IonLabel, IonRouterLink, IonTabBar, IonTabButton } from '@ionic/angular/standalone';

/** Barra de navegação inferior (fica visível em todas as páginas). */
@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterLink, RouterLink, RouterLinkActive],
  templateUrl: './tab-bar.component.html',
  styleUrl: './tab-bar.component.scss',
})
export class TabBarComponent {
  readonly abas = [
    { rota: '/home', icone: 'home-outline', titulo: 'Home' },
    { rota: '/catalogo', icone: 'film-outline', titulo: 'Catálogo' },
    { rota: '/favoritos', icone: 'heart-outline', titulo: 'Favoritos' },
  ];
}
