# AnimeHub — Ionic + Angular Standalone

Catálogo de animes com Home, Catálogo, Detalhes e Favoritos. Dados públicos da **Kitsu API** (`https://kitsu.io/api/edge`), sem token.

## Instalar e executar

Necessário Node.js 18+ e acesso à internet.

```powershell
npm install
npm start
```

Abra http://localhost:4200. Os avisos de `npm audit` não significam que a instalação falhou; **não use `npm audit fix --force` sem analisar as mudanças**.

## O que foi corrigido

- A API Jikan original foi descontinuada em outubro de 2026, e a tentativa de usar Tenrai falhou na rede informada. Substituímos o provedor por Kitsu, com endpoints REST públicos.
- Serviço `src/app/services/anime.service.ts`: três métodos com `HttpClient` / **GET**:
  1. `getTopAnime()` → `GET /anime?sort=-averageRating` ou `sort=-userCount`;
  2. `searchAnime()` → `GET /anime?filter[text]=naruto` e opcional `filter[categories]`;
  3. `getAnimeDetails()` → `GET /anime/{id}?include=categories`.
- `src/app/services/kitsu-adapter.ts`: converte o JSON:API da Kitsu para o formato que Home, Catálogo, Detalhes e Favoritos já usam; inclusive pôster, nota (0–100 para 0–10), sinopse, data, status, episódios, gêneros e paginação.
- Paginação da Kitsu limitada a 20 itens por requisição; os filtros de gêneros usam os **slugs Kitsu**.
- Os favoritos usam nova chave de armazenamento (`animehub:favoritos:kitsu-v1`) para evitar confundir IDs da antiga MyAnimeList com IDs da Kitsu. Os favoritos antigos não são apagados, mas não aparecem na lista nova.
- Mensagens de erro, timeout, retry para erros transitórios e teste de conectividade com causas técnicas detalhadas.

## Se o teste falhar

`npm run test:api` precisa alcançar a internet **no computador onde você está rodando o app**. Se exibir `fetch failed`, anote o código técnico (`ENOTFOUND`, `ETIMEDOUT`, etc.) e teste no PowerShell:

```powershell
nslookup kitsu.io
curl.exe -I https://kitsu.io/api/edge/anime/1
```

- `ENOTFOUND` / `EAI_AGAIN`: DNS / rede;
- `ETIMEDOUT` / `ECONNRESET`: conexão, firewall ou servidor;
- erros de certificado (`CERT_...`): proxy/antivírus/certificados;
- `HTTP 429`: muitas consultas em pouco tempo.

Se a conexão com a Kitsu estiver bloqueada em sua rede, **trocar o código não substitui o acesso à internet**. Compare o resultado em outra rede / hotspot antes de alterar a aplicação novamente.

## Onde ficam os requisitos

- 4 telas: `src/app/pages/` (Home, Catálogo, Detalhes e Favoritos).
- 3 métodos GET e HttpClient: `src/app/services/anime.service.ts`.
- 2 serviços: `AnimeService` e `FavoritesService` (localStorage).
- 2 pipes próprios: `ScorePipe` e `SynopsisPipe`; 2 pipes Angular: `DatePipe` e `UpperCasePipe`.
- 2 diretivas próprias: `FavoriteButtonDirective` e `HighlightScoreDirective`.
- Diretivas estruturais `@if` e `@for` em todos os templates.
- Parâmetro de rota: `/detalhes/:id` (`app.routes.ts` / `detalhes.page.ts`).
- Projeto Angular Standalone + Ionic, estilos mantidos.

### Documentação externa

- https://hummingbird-me.github.io/api-docs/
- https://kitsu.io/api/edge/anime
