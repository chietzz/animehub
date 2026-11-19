/**
 * Verificação independente dos 3 GETs Kitsu (Node 18+).
 * Não usa a interface e não depende de bibliotecas externas.
 * Requer acesso à internet; erros de DNS/proxy/TLS são exibidos com sua causa.
 */
const BASE = 'https://kitsu.io/api/edge';
const testes = [
  {
    nome: 'Listagem dos melhores animes',
    caminho: '/anime?sort=-averageRating&page%5Blimit%5D=3&page%5Boffset%5D=0',
    tipo: 'lista',
  },
  {
    nome: 'Busca por Naruto',
    caminho: '/anime?filter%5Btext%5D=naruto&page%5Blimit%5D=3&page%5Boffset%5D=0',
    tipo: 'lista',
  },
  {
    nome: 'Detalhes de anime por ID',
    caminho: '/anime/1?include=categories',
    tipo: 'detalhe',
  },
];

let falhas = 0;
for (const teste of testes) {
  console.log(`\nGET ${BASE}${teste.caminho}`);
  try {
    const resposta = await fetch(`${BASE}${teste.caminho}`, {
      headers: { Accept: 'application/vnd.api+json' },
      signal: AbortSignal.timeout(15000),
    });
    if (!resposta.ok) {
      throw new Error(`HTTP ${resposta.status}: ${(await resposta.text()).slice(0, 160)}`);
    }
    const json = await resposta.json();
    if (teste.tipo === 'lista') {
      if (!Array.isArray(json.data) || !json.data.length || !json.data[0].attributes?.canonicalTitle) {
        throw new Error('Formato inesperado: falta data[0].attributes.canonicalTitle');
      }
      console.log(`OK — ${teste.nome}: ${json.data.length} animes (ex.: ${json.data[0].attributes.canonicalTitle})`);
    } else {
      if (!json.data?.id || !json.data?.attributes?.canonicalTitle) {
        throw new Error('Formato inesperado: falta data.id ou data.attributes.canonicalTitle');
      }
      console.log(`OK — ${teste.nome}: ${json.data.attributes.canonicalTitle} (ID Kitsu ${json.data.id})`);
    }
  } catch (erro) {
    falhas++;
    console.error(`FALHOU — ${teste.nome}: ${erro.message}`);
    let causa = erro.cause;
    while (causa) {
      console.error(`  Causa técnica: ${causa.code || causa.name || 'desconhecida'} — ${causa.message || String(causa)}`);
      causa = causa.cause;
    }
  }
}
console.log(`\nResultado: ${testes.length - falhas}/${testes.length} GETs OK`);
if (falhas) {
  console.log(`\nSe todos falharem com "fetch failed", confira a rede no Windows:`);
  console.log('  nslookup kitsu.io');
  console.log('  curl.exe -I https://kitsu.io/api/edge/anime/1');
  console.log('Se o curl.exe funcionar e o Node falhar, investigue proxy, DNS e certificados do Node.');
  process.exitCode = 1;
}
