import { Routes } from '@angular/router';

// Rotas do AnimeHub. Cada página é carregada só quando o usuário entra nela (loadComponent).
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage) },

  { path: 'catalogo', loadComponent: () => import('./pages/catalogo/catalogo.page').then((m) => m.CatalogoPage) },

  // Rota com PARÂMETRO: o ":id" recebe o número do anime. Exemplo de endereço: /detalhes/21
  { path: 'detalhes/:id', loadComponent: () => import('./pages/detalhes/detalhes.page').then((m) => m.DetalhesPage) },

  { path: 'favoritos', loadComponent: () => import('./pages/favoritos/favoritos.page').then((m) => m.FavoritosPage) },

  // Qualquer endereço desconhecido volta para a Home.
  { path: '**', redirectTo: 'home' },
];
