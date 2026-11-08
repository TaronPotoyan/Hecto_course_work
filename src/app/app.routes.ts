// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/homePage/homePage.component';
import { ProductPageComponent } from './pages/productPage/productPage.component';
import { ProductDetailsPageComponent } from './pages/productDetailsPage/productDetailsPage.component';
import { BasketPageComponent } from './pages/basketPage/basketPage.component';
import { LoginPageComponent } from './pages/loginComponent/login-component';
import { ErrorPageComponent } from './pages/errorPage/errorPage.component';
import { AppRoutes } from './models/enum';

export const routes: Routes = [
  {
    path: AppRoutes.Home,
    component: HomePageComponent,
    pathMatch: 'full',
  },
  {
    path: AppRoutes.HomeAlias,
    redirectTo: AppRoutes.Home,
  },
  {
    path: AppRoutes.Heckto,
    redirectTo: AppRoutes.Home,
  },
  {
    path: AppRoutes.Products,
    children: [
      {
        path: AppRoutes.Home,
        component: ProductPageComponent,
      },
      {
        path: AppRoutes.ProductDetails,
        component: ProductDetailsPageComponent,
      },
    ],
  },
  {
    path: AppRoutes.Login,
    component: LoginPageComponent,
  },
  {
    path: AppRoutes.Basket,
    component: BasketPageComponent,
  },
  {
    path: AppRoutes.Profile,
    loadComponent: () =>
      import('./pages/profilePage/profilePage.component').then((m) => m.ProfilePageComponent),
  },
  {
    path: AppRoutes.MyAccount,
    redirectTo: AppRoutes.Profile,
  },
  {
    path: AppRoutes.Blog,
    children: [
      {
        path: AppRoutes.Home,
        loadComponent: () =>
          import('./pages/blogPage/blogPage.component').then((m) => m.BlogPageComponent),
      },
      {
        path: AppRoutes.BlogPost,
        loadComponent: () =>
          import('./pages/blogPage/blogPostPage.component').then((m) => m.BlogPostPageComponent),
      },
    ],
  },
  {
    path: AppRoutes.Contact,
    loadComponent: () =>
      import('./pages/contactPage/contactPage.component').then((m) => m.ContactPageComponent),
  },
  {
    path: AppRoutes.NotFound,
    component: ErrorPageComponent,
  },
];
