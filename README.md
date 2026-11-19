# 🎌 AnimeHub

### Seu universo de animes em um só lugar!

O **AnimeHub** é uma aplicação desenvolvida utilizando **Ionic 8 e Angular 19**, com o objetivo de oferecer uma plataforma para explorar, pesquisar e descobrir animes de maneira simples, organizada e intuitiva.

O projeto utiliza a **Kitsu API** para obter informações atualizadas sobre animes, incluindo títulos, imagens, avaliações, sinopses, gêneros e episódios.

A aplicação foi desenvolvida como parte de um projeto acadêmico, aplicando conceitos de desenvolvimento mobile com Ionic e Angular Standalone.

---

## 🚀 Funcionalidades

- 🏠 **Home:** exibição de animes populares, mais bem avaliados e destaques.
- 🔎 **Catálogo:** pesquisa de animes por nome, filtros de gênero e navegação pelos resultados.
- 📖 **Detalhes:** informações completas sobre os animes, incluindo sinopse, avaliação, episódios e gêneros.
- ❤️ **Favoritos:** possibilidade de adicionar e remover animes da lista de favoritos.
- 📱 **Interface responsiva:** layout adaptado para diferentes tamanhos de tela.
- 🌐 **Integração com API:** informações obtidas por requisições HTTP.
- 💾 **Armazenamento local:** favoritos salvos no navegador utilizando localStorage.

## 🛠️ Tecnologias utilizadas

- **Ionic 8** — componentes de interface e desenvolvimento mobile.
- **Angular 19** — framework utilizado na construção da aplicação.
- **TypeScript** — lógica e funcionalidades do sistema.
- **HTML5** — estrutura das páginas.
- **SCSS** — estilização e responsividade.
- **Angular Router** — navegação entre páginas.
- **HttpClient** — comunicação com a API.
- **Kitsu API** — fornecimento dos dados dos animes.
- **LocalStorage** — armazenamento dos favoritos.

## 🌐 API utilizada

O projeto utiliza a **Kitsu API**, uma API pública que disponibiliza informações sobre animes.

**URL base:** https://kitsu.io/api/edge

A aplicação realiza três tipos principais de requisições GET:

1. Listagem dos animes mais bem avaliados e populares.
2. Pesquisa de animes por nome e filtros.
3. Consulta de detalhes de um anime pelo ID.

## 📂 Estrutura do projeto

```text
src/
└── app/
    ├── components/
    │   ├── anime-card/
    │   ├── card-esqueleto/
    │   ├── estado/
    │   └── tab-bar/
    │
    ├── pages/
    │   ├── home/
    │   ├── catalogo/
    │   ├── detalhes/
    │   └── favoritos/
    │
    ├── services/
    │   ├── anime.service.ts
    │   └── favorites.service.ts
    │
    ├── pipes/
    │   ├── score.pipe.ts
    │   └── synopsis.pipe.ts
    │
    ├── directives/
    │   ├── favorite-button.directive.ts
    │   └── highlight-score.directive.ts
    │
    └── app.routes.ts
```

## ⚙️ Como executar o projeto

### Pré-requisitos

- Node.js compatível com Angular 19
- NPM
- Git
- Acesso à internet

### 1. Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Acesse a pasta do projeto

```bash
cd animehub
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Execute a aplicação

```bash
npm start
```

### 5. Acesse no navegador

http://localhost:4200

### Testar a API

Para verificar a comunicação com a Kitsu API:

```bash
npm run test:api
```

### Gerar a versão de produção

```bash
npm run build
```

**Observação:** a aplicação necessita de conexão com a internet para consultar os animes. Os favoritos são armazenados localmente no navegador.

## 📋 Requisitos acadêmicos implementados

O projeto foi desenvolvido atendendo aos seguintes requisitos:

- ✅ Quatro páginas funcionais: Home, Catálogo, Detalhes e Favoritos.
- ✅ Integração com API pública utilizando três métodos GET.
- ✅ Quatro pipes: duas personalizadas e duas nativas do Angular.
- ✅ Dois services com responsabilidades diferentes.
- ✅ Duas diretivas personalizadas.
- ✅ Utilização das diretivas estruturais `@if` e `@for`.
- ✅ Passagem de parâmetros entre páginas utilizando rotas.
- ✅ Utilização de Ionic com Angular Standalone.

## 🎯 Objetivo do projeto

O principal objetivo do AnimeHub é aplicar os conhecimentos adquiridos em desenvolvimento mobile, utilizando recursos do Angular e Ionic para construir uma aplicação funcional, organizada e visualmente agradável.

Além disso, o projeto permite colocar em prática conceitos como consumo de APIs REST, componentização, navegação por rotas, utilização de services, pipes, diretivas e persistência de dados.

---

## 📚 Projeto acadêmico

Desenvolvido para a disciplina de **Desenvolvimento Mobile**, com foco na utilização do framework Ionic integrado ao Angular.

**AnimeHub — Explore, descubra e favorite seus animes!** 🎌
