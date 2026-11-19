import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

/** Mensagem de estado: usada para "erro", "nada encontrado" e "sem favoritos". O botão de ação vai dentro da tag. */
@Component({
  selector: 'app-estado',
  standalone: true,
  imports: [IonIcon],
  templateUrl: './estado.component.html',
  styleUrl: './estado.component.scss',
})
export class EstadoComponent {
  @Input() icone = 'alert-circle-outline';
  @Input({ required: true }) titulo!: string;
  @Input() mensagem = '';
  /** true para erros: o leitor de tela anuncia na hora. */
  @Input() alerta = false;
}
