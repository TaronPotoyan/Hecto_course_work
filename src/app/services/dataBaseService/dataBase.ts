// src/app/services/dataBaseService/dataBase.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { IDiscountProduct, IProduct } from '../../models/interface';
import { FutureProduct, ProductDescription } from '../../models/enum';
import { API_BASE_URL } from '../api';

export type LoadState = 'loading' | 'ready' | 'error';

/**
 * Catalog store backed by the REST API (`server/`).
 * Data is loaded once and exposed as signals; the getters read those signals,
 * so calling them inside `computed()` / templates re-evaluates when data arrives.
 */
@Injectable({
  providedIn: 'root',
})
export class DataBase {
  private http = inject(HttpClient);
  private apiUrl = inject(API_BASE_URL);

  private readonly products = signal<IProduct[]>([]);
  private readonly discountedProducts = signal<IDiscountProduct[]>([]);
  private readonly topCategories = signal<IProduct[]>([]);

  readonly state = signal<LoadState>('loading');
  readonly isLoading = computed(() => this.state() === 'loading');
  readonly defaultPerPage = 10;

  constructor() {
    this.load();
  }

  load() {
    this.state.set('loading');
    forkJoin({
      products: this.http.get<IProduct[]>(`${this.apiUrl}/api/products`),
      promotions: this.http.get<IDiscountProduct[]>(`${this.apiUrl}/api/promotions`),
      topCategories: this.http.get<IProduct[]>(`${this.apiUrl}/api/top-categories`),
    }).subscribe({
      next: ({ products, promotions, topCategories }) => {
        this.products.set(products);
        this.discountedProducts.set(promotions);
        this.topCategories.set(topCategories);
        this.state.set('ready');
      },
      error: (err) => {
        console.error('Failed to load catalog from API', err);
        this.state.set('error');
      },
    });
  }

  getProductsInRange(pageNum: number, perPage = this.defaultPerPage): [IProduct[], number] {
    const to = pageNum * perPage;
    const from = (pageNum - 1) * perPage;
    return [this.products().slice(from, to), this.getPageCount(perPage)];
  }

  getPageCount(perPage = this.defaultPerPage): number {
    return Math.ceil(this.products().length / perPage);
  }

  getTopCategories(): IProduct[] {
    return this.topCategories();
  }

  getDiscountedProducts(): IDiscountProduct[] {
    return this.discountedProducts();
  }

  getProducts(): IProduct[] {
    return this.products();
  }

  getFirstN(n: number): IProduct[] {
    return this.products().slice(0, n);
  }

  getFeaturedProducts(): IProduct[] {
    return this.products()
      .filter((pr) => pr.type === FutureProduct.Tech)
      .slice(0, 4);
  }

  getProductById(id: number): IProduct | null {
    return this.products().find((product) => product.id === id) ?? null;
  }

  getTrendProducts(): IProduct[] {
    return this.products().filter((pr) => pr.type === FutureProduct.Trend);
  }

  /** Blog posts are catalog entries of type Home that have an author. */
  getHomes(): IProduct[] {
    return this.products().filter((pr) => pr.type === ProductDescription.Home && !!pr.owner);
  }

  getSimilarItems(product: IProduct): IProduct[] {
    return this.products()
      .filter(
        (item) =>
          item.id !== product.id &&
          (item.name === product.name ||
            (!!product.category && item.category === product.category)),
      )
      .slice(0, 3);
  }
}
