import { Directive, HostBinding, Input } from '@angular/core';

/**
 * HighlightScoreDirective — destaca notas altas.
 * Uso no HTML:  <span [appHighlightScore]="anime.score">...</span>
 * Se a nota for maior que 8.5, o texto fica dourado e brilha. (O limite pode ser mudado: [limiteNota]="9")
 */
@Directive({ selector: '[appHighlightScore]', standalone: true })
export class HighlightScoreDirective {
  /** A nota do anime (vem do próprio atributo da diretiva). */
  @Input('appHighlightScore') nota: number | null | undefined;

  /** A partir de qual nota o destaque aparece. */
  @Input() limiteNota = 8.5;

  private get notaAlta(): boolean {
    return typeof this.nota === 'number' && this.nota > this.limiteNota;
  }

  // @HostBinding liga propriedades do elemento onde a diretiva foi colocada.
  @HostBinding('class.nota-alta') get classeNotaAlta(): boolean {
    return this.notaAlta;
  }

  @HostBinding('style.color') get cor(): string | null {
    return this.notaAlta ? '#ffc857' : null; // null = não mexe no estilo
  }

  @HostBinding('style.text-shadow') get brilho(): string | null {
    return this.notaAlta ? '0 0 14px rgba(255, 200, 87, 0.55)' : null;
  }

  @HostBinding('style.font-weight') get peso(): string | null {
    return this.notaAlta ? '700' : null;
  }
}
