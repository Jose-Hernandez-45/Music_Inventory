import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'adm-p',
    loadComponent: () => import('./pages/adm-p/adm-p.page').then( m => m.AdmPPage)
  },
  {
    path: 'add-product',
    loadComponent: () => import('./pages/add-product/add-product.page').then( m => m.AddProductPage)
  },
  {
    path: 'edit-product/:id',
    loadComponent: () => import('./pages/edit-product/edit-product.page').then(m => m.EditProductPage)
  }
];
