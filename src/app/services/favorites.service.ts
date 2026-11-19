import { Injectable, signal } from '@angular/core';

import { AnimeResumo } from '../models/anime.model';

/**
 * FavoritesService: cuida SOMENTE dos favoritos, guardados no localStorage do navegador.
 * Por isso eles continuam salvos mesmo depois de fechar e abrir o app de novo.
 *
 * A lista é um "signal": quando ela muda, todas as telas que a usam se atualizam sozinhas.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  // Chave nova: evita misturar IDs MyAnimeList antigos com IDs Kitsu.
  private readonly chave = 'animehub:favoritos:kitsu-v1';
  private readonly favoritos = signal<AnimeResumo[]>(this.lerDoArmazenamento());

  /** Devolve a lista de favoritos (os mais recentes primeiro). */
  getFavorites(): AnimeResumo[] {
    return this.favoritos();
  }

  /** Diz se o anime com esse id já está nos favoritos. */
  isFavorite(id: number): boolean {
    return this.favoritos().some((anime) => anime.mal_id === id);
  }

  /** Adiciona um anime aos favoritos (se ainda não estiver). */
  addFavorite(anime: AnimeResumo): void {
    if (this.isFavorite(anime.mal_id)) {
      return;
    }
    this.salvar([this.resumir(anime), ...this.favoritos()]);
  }

  /** Remove o anime dos favoritos. */
  removeFavorite(id: number): void {
    this.salvar(this.favoritos().filter((anime) => anime.mal_id !== id));
  }

  /** Atalho para os botões de coração: adiciona se não for favorito, remove se for. */
  toggleFavorite(anime: AnimeResumo): void {
    if (this.isFavorite(anime.mal_id)) {
      this.removeFavorite(anime.mal_id);
    } else {
      this.addFavorite(anime);
    }
  }

  // ---------------------------------------------------------------------------

  private salvar(lista: AnimeResumo[]): void {
    this.favoritos.set(lista);
    try {
      localStorage.setItem(this.chave, JSON.stringify(lista));
    } catch {
      // Se o navegador bloquear o localStorage, o app continua funcionando (só não guarda).
    }
  }

  private lerDoArmazenamento(): AnimeResumo[] {
    try {
      const texto = localStorage.getItem(this.chave);
      const lista: unknown = texto ? JSON.parse(texto) : [];
      return Array.isArray(lista) ? lista.filter((a) => typeof a?.mal_id === 'number') : [];
    } catch {
      return []; // dado corrompido ou localStorage indisponível
    }
  }

  /** Guarda só o necessário (a sinopse é cortada para o localStorage não encher à toa). */
  private resumir(anime: AnimeResumo): AnimeResumo {
    return {
      mal_id: anime.mal_id,
      title: anime.title,
      title_english: anime.title_english ?? null,
      type: anime.type ?? null,
      episodes: anime.episodes ?? null,
      score: anime.score ?? null,
      synopsis: anime.synopsis ? anime.synopsis.slice(0, 400) : null,
      images: {
        jpg: {
          image_url: anime.images?.jpg?.image_url ?? null,
          large_image_url: anime.images?.jpg?.large_image_url ?? null,
        },
      },
    };
  }
}
