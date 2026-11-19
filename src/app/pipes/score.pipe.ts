import { Pipe, PipeTransform } from '@angular/core';

/**
 * ScorePipe — transforma uma nota em texto.
 * Uso no HTML:  {{ anime.score | score }}   →   "Nota: 9.2/10"
 * Se o anime ainda não tem nota, mostra "Sem nota".
 */
@Pipe({ name: 'score', standalone: true })
export class ScorePipe implements PipeTransform {
  transform(nota: number | null | undefined): string {
    if (nota === null || nota === undefined || Number.isNaN(nota)) {
      return 'Sem nota';
    }
    return `Nota: ${nota.toFixed(1)}/10`;
  }
}
