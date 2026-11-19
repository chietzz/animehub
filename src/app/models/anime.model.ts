// Modelos (interfaces) do AnimeHub.
// Formato interno compatível com as telas originais; Kitsu é convertida pelo kitsu-adapter.
// Atenção: "mal_id" é um nome legado, mas agora armazena o ID da Kitsu.

export interface ImagemAnime {
  image_url: string | null;
  small_image_url?: string | null;
  large_image_url?: string | null;
}

export interface Genero {
  mal_id: number;
  name: string;
}

export interface PeriodoExibicao {
  from: string | null; // data de início, ex.: "2009-04-05T00:00:00+00:00"
  to: string | null;
  string: string | null;
}

/** Um anime completo, como vem da API (campos que o app usa). */
export interface Anime {
  mal_id: number; // ID da Kitsu (nome de propriedade legado; usado na rota /detalhes/:id)
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string | null; // TV, Movie, OVA...
  episodes: number | null;
  status: string | null;
  duration: string | null;
  score: number | null; // nota de 0 a 10
  synopsis: string | null;
  year: number | null;
  images: { jpg: ImagemAnime };
  aired: PeriodoExibicao | null;
  genres: Genero[];
}

/** Versão resumida: é o que os cards mostram e o que fica salvo nos favoritos. */
export type AnimeResumo = Pick<
  Anime,
  'mal_id' | 'title' | 'title_english' | 'type' | 'episodes' | 'score' | 'synopsis' | 'images'
>;

export interface Paginacao {
  current_page: number;
  last_visible_page: number;
  has_next_page: boolean;
}

/** Resposta dos endpoints que devolvem uma lista (/anime (listas Kitsu adaptadas)). */
export interface RespostaLista {
  data: Anime[];
  pagination: Paginacao;
}

/** Resposta do endpoint de um anime só (/anime/{id}). */
export interface RespostaDetalhe {
  data: Anime;
}

export interface GeneroFiltro {
  id: number; // id do gênero na API
  nome: string; // nome mostrado no app
}

/** Códigos internos do filtro. O AnimeService traduz cada código para um slug da Kitsu. */
export const GENEROS_CATALOGO: GeneroFiltro[] = [
  { id: 1, nome: 'Ação' },
  { id: 2, nome: 'Aventura' },
  { id: 4, nome: 'Comédia' },
  { id: 8, nome: 'Drama' },
  { id: 10, nome: 'Fantasia' },
  { id: 22, nome: 'Romance' },
  { id: 24, nome: 'Ficção científica' },
  { id: 36, nome: 'Cotidiano' },
  { id: 37, nome: 'Sobrenatural' },
  { id: 7, nome: 'Mistério' },
  { id: 41, nome: 'Suspense' },
  { id: 14, nome: 'Terror' },
  { id: 30, nome: 'Esportes' },
];
