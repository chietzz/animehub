import { Pipe, PipeTransform } from '@angular/core';

import { limparSinopse } from '../utils/anime-helpers';

/**
 * SynopsisPipe — limita o tamanho de uma sinopse e adiciona reticências quando corta.
 * Uso no HTML:  {{ anime.synopsis | synopsis: 120 }}   (120 = máximo de caracteres; o padrão é 150)
 */
@Pipe({ name: 'synopsis', standalone: true })
export class SynopsisPipe implements PipeTransform {
  transform(texto: string | null | undefined, limite = 150): string {
    if (!texto) {
      return 'Sinopse não disponível.';
    }

    const limpo = limparSinopse(texto); // tira a assinatura "[Written by MAL Rewrite]"

    if (limpo.length <= limite) {
      return limpo;
    }

    // Corta no último espaço antes do limite para não quebrar uma palavra no meio.
    const ultimoEspaco = limpo.lastIndexOf(' ', limite);
    const fim = ultimoEspaco > limite * 0.6 ? ultimoEspaco : limite;
    return limpo.slice(0, fim).trimEnd() + '...';
  }
}
