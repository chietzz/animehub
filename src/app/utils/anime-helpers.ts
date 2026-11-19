import { AnimeResumo } from '../models/anime.model';

/** Imagem usada quando o anime não tem pôster (ou quando a imagem não carrega). */
export const IMAGEM_PADRAO = 'assets/sem-imagem.svg';

/** Nome mostrado no app: prefere o título em inglês e usa o título principal se não houver. */
export function nomeDoAnime(anime: Pick<AnimeResumo, 'title' | 'title_english'>): string {
  return anime.title_english || anime.title;
}

/** Escolhe a melhor imagem disponível, tratando o caso de a API não enviar nenhuma. */
export function escolherImagem(anime: Pick<AnimeResumo, 'images'>): string {
  const jpg = anime.images?.jpg;
  return jpg?.large_image_url || jpg?.image_url || IMAGEM_PADRAO;
}

/** Use em <img (error)="trocarPorImagemPadrao($event)"> para nunca mostrar imagem quebrada. */
export function trocarPorImagemPadrao(evento: Event): void {
  const img = evento.target as HTMLImageElement;
  if (!img.src.endsWith(IMAGEM_PADRAO)) {
    img.src = IMAGEM_PADRAO;
  }
}

/** Tira a assinatura que a API coloca no fim de muitas sinopses e apara os espaços. */
export function limparSinopse(texto: string | null | undefined): string {
  return (texto ?? '').replace(/\s*\[Written by MAL Rewrite\]\s*/gi, '').trim();
}
