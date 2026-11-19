import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  albumsOutline,
  alertCircleOutline,
  calendarOutline,
  chevronForward,
  cloudOfflineOutline,
  filmOutline,
  flame,
  heart,
  heartDislikeOutline,
  heartOutline,
  homeOutline,
  pulseOutline,
  refresh,
  searchOutline,
  star,
  timeOutline,
  trophy,
} from 'ionicons/icons';

import { TabBarComponent } from './components/tab-bar/tab-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [IonApp, IonRouterOutlet, TabBarComponent],
})
export class AppComponent {
  constructor() {
    // No modo standalone, todo ícone usado em <ion-icon name="..."> precisa ser registrado aqui.
    addIcons({
      albumsOutline,
      alertCircleOutline,
      calendarOutline,
      chevronForward,
      cloudOfflineOutline,
      filmOutline,
      flame,
      heart,
      heartDislikeOutline,
      heartOutline,
      homeOutline,
      pulseOutline,
      refresh,
      searchOutline,
      star,
      timeOutline,
      trophy,
    });
  }
}
