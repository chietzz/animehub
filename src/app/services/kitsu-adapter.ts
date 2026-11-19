import type { Anime, Genero, RespostaDetalhe, RespostaLista } from '../models/anime.model';

/**
 * Formato JSON:API retornado por https://kitsu.io/api/edge.
 * Os IDs deste provedor são IDs Kitsu (não IDs MyAnimeList).
 */
export interface RecursoKitsu {
  id: string;
  type: string;
  attributes: {
    canonicalTitle?: string | null;
    titles?: { en?: string | null; en_jp?: string | null; ja_jp?: string | null } | null;
    subtype?: string | null;
    episodeCount?: number | null;
    episodeLength?: number | null;
    status?: string | null;
    averageRating?: string | number | null;
    synopsis?: string | null;
    description?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    posterImage?: { small?: string | null; medium?: string | null; large?: string | null; original?: string | null } | null;
    nsfw?: boolean | null;
    slug?: string | null;
    title?: string | null;
  };
  relationships?: { categories?: { data?: Array<{ id: string }> } };
}

export interface RespostaListaKitsu {
  data: RecursoKitsu[];
  links?: { next?: string | null };
  meta?: { count?: number };
  included?: RecursoKitsu[];
}
export interface RespostaDetalheKitsu {
  data: RecursoKitsu;
  included?: RecursoKitsu[];
}

function converterStatus(status?: string | null): string | null {
  switch (status) {
    case 'current': return 'Currently Airing';
    case 'finished': return 'Finished Airing';
    case 'tba': case 'unreleased': case 'upcoming': return 'Not yet aired';
    default: return status ?? null;
  }
}

/** Converte a resposta da Kitsu para o modelo que as quatro telas do AnimeHub usam. */
export function converterAnimeKitsu(recurso: RecursoKitsu, incluidos: RecursoKitsu[] = []): Anime {
  const a = recurso.attributes;
  const capas = a.posterImage;
  const nota = a.averageRating == null ? NaN : Number(a.averageRating) / 10;
  const id = Number(recurso.id);
  const nome = a.canonicalTitle || a.titles?.en_jp || a.titles?.en || `Anime ${recurso.id}`;
  const mapaCategorias = new Map(incluidos.filter((r) => r.type === 'categories').map((r) => [r.id, r]));
  const generos: Genero[] = (recurso.relationships?.categories?.data ?? [])
    .map((r) => mapaCategorias.get(r.id))
    .filter((r): r is RecursoKitsu => !!r)
    .map((r) => ({ mal_id: Number(r.id), name: r.attributes.title || r.attributes.canonicalTitle || r.attributes.slug || 'Categoria' }))
    .filter((g) => Number.isSafeInteger(g.mal_id));

  return {
    mal_id: id, // Nome legado preservado só para não quebrar as telas: é um ID da Kitsu!
    title: nome,
    title_english: a.titles?.en || null,
    title_japanese: a.titles?.ja_jp || null,
    type: a.subtype ?? null,
    episodes: a.episodeCount ?? null,
    status: converterStatus(a.status),
    duration: a.episodeLength ? `${a.episodeLength} min per ep` : null,
    score: Number.isFinite(nota) ? Math.max(0, Math.min(10, nota)) : null,
    synopsis: a.synopsis || a.description || null,
    year: a.startDate ? Number(a.startDate.slice(0, 4)) || null : null,
    images: {
      jpg: {
        image_url: capas?.medium || capas?.small || capas?.large || null,
        small_image_url: capas?.small || null,
        large_image_url: capas?.large || capas?.original || capas?.medium || null,
      },
    },
    aired: a.startDate || a.endDate
      ? { from: a.startDate || null, to: a.endDate || null, string: null }
      : null,
    genres: generos,
  };
}

export function converterListaKitsu(resposta: RespostaListaKitsu, pagina: number, limite: number): RespostaLista {
  if (!Array.isArray(resposta.data)) {
    throw new Error('Resposta inválida da Kitsu: a lista de animes não foi enviada.');
  }
  const quantidade = resposta.meta?.count;
  const ultima = typeof quantidade === 'number' && quantidade >= 0
    ? Math.max(1, Math.ceil(quantidade / limite))
    : pagina + (resposta.links?.next ? 1 : 0);
  return {
    data: resposta.data
      .filter((r) => r.type === 'anime' && !!r.attributes && r.attributes.nsfw !== true && Number.isSafeInteger(Number(r.id)))
      .map((r) => converterAnimeKitsu(r, resposta.included)),
    pagination: {
      current_page: pagina,
      last_visible_page: ultima,
      has_next_page: !!resposta.links?.next || (typeof quantidade === 'number' && pagina * limite < quantidade),
    },
  };
}

export function converterDetalheKitsu(resposta: RespostaDetalheKitsu): RespostaDetalhe {
  if (!resposta.data || resposta.data.type !== 'anime' || !resposta.data.attributes) {
    throw new Error('Resposta inválida da Kitsu: dados do anime não encontrados.');
  }
  if (resposta.data.attributes.nsfw === true) {
    throw new Error('Este anime não está disponível no catálogo público.');
  }
  return { data: converterAnimeKitsu(resposta.data, resposta.included) };
}
