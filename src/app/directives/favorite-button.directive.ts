import { Directive, HostBinding, HostListener, Input } from '@angular/core';

/**
 * FavoriteButtonDirective — muda o visual do botão de coração quando o anime está favoritado.
 * Uso no HTML:  <ion-button [appFavoriteButton]="estaFavoritado">...</ion-button>
 *
 *  - @HostBinding: liga classes e atributos no próprio botão (rosa quando favoritado).
 *  - @HostListener: escuta o clique no botão para tocar uma animação rápida.
 * As cores ficam em src/global.scss (classes btn-favorito...).
 */
@Directive({ selector: '[appFavoriteButton]', standalone: true })
export class FavoriteButtonDirective {
  /** true quando o anime está nos favoritos. */
  @Input('appFavoriteButton') favorito = false;

  @HostBinding('class.btn-favorito') readonly classeBase = true;

  @HostBinding('class.btn-favorito--ativo') get classeAtivo(): boolean {
    return this.favorito;
  }

  @HostBinding('class.btn-favorito--pulsando') pulsando = false;

  @HostBinding('attr.aria-pressed') get ariaPressed(): string {
    return String(this.favorito);
  }

  @HostBinding('attr.title') get dica(): string {
    return this.favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
  }

  @HostListener('click')
  aoClicar(): void {
    this.pulsando = true;
    setTimeout(() => (this.pulsando = false), 450);
  }
}
