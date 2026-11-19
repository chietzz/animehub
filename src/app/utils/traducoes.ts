// A Kitsu API devolve alguns textos em inglês (status, tipo, gênero).
// Estas funções traduzem os mais comuns e, se não conhecerem o texto, devolvem o original.

const STATUS: Record<string, string> = {
  'Finished Airing': 'Finalizado',
  'Currently Airing': 'Em exibição',
  'Not yet aired': 'Ainda não lançado',
};

const TIPOS: Record<string, string> = {
  TV: 'TV',
  Movie: 'Filme',
  OVA: 'OVA',
  ONA: 'ONA',
  Special: 'Especial',
  'TV Special': 'Especial de TV',
  Music: 'Música',
};

const GENEROS: Record<string, string> = {
  Action: 'Ação',
  Adventure: 'Aventura',
  'Avant Garde': 'Vanguarda',
  'Award Winning': 'Premiado',
  Comedy: 'Comédia',
  Drama: 'Drama',
  Fantasy: 'Fantasia',
  Gourmet: 'Gastronomia',
  Horror: 'Terror',
  Mystery: 'Mistério',
  Romance: 'Romance',
  'Sci-Fi': 'Ficção científica',
  'Slice of Life': 'Cotidiano',
  Sports: 'Esportes',
  Supernatural: 'Sobrenatural',
  Suspense: 'Suspense',
};

export function traduzirStatus(status: string | null | undefined): string {
  return status ? (STATUS[status] ?? status) : 'Não informado';
}

export function traduzirTipo(tipo: string | null | undefined): string {
  return tipo ? (TIPOS[tipo] ?? tipo) : '';
}

export function traduzirGenero(nome: string): string {
  return GENEROS[nome] ?? nome;
}

export function traduzirDuracao(duracao: string | null | undefined): string {
  if (!duracao || duracao === 'Unknown') {
    return 'Não informada';
  }
  return duracao.replace(/\bper ep\b/i, 'por episódio').replace(/\bhr\b/gi, 'h');
}
