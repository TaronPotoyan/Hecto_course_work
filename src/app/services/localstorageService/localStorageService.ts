// src/app/services/localstorageService/localStorageService.ts
import { Injectable, afterNextRender, computed, inject, signal } from '@angular/core';
import { IProduct } from '../../models/interface';
import { ToastService } from '../toastService/toastService';

const STORAGE_KEY = 'Heckto';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private basket = signal<IProduct[]>([]);
  private toast = inject(ToastService);

  /** Total number of units in the basket (for the header badge). */
  readonly basketCount = computed(() =>
    this.basket().reduce((acc, item) => acc + (item.quantity ?? 1), 0),
  );

  constructor() {
    afterNextRender(() => {
      this.loadBasketFromStorage();
    });
  }

  getBasketSignal() {
    return this.basket.asReadonly();
  }

  clearBasket() {
    this.basket.set([]);
    this.syncToStorage([]);
  }

  removeFromBasket(productId: number) {
    this.basket.update((items) => items.filter((i) => i.id !== productId));
    this.syncToStorage(this.basket());
  }

  updateQuantity(productId: number, count: number): boolean {
    const items = this.basket();
    const product = items.find((p) => p.id === productId);
    if (!product) return false;

    const newQuantity = (product.quantity ?? 1) + count;
    const newItems =
      newQuantity <= 0
        ? items.filter((p) => p.id !== productId)
        : items.map((p) => (p.id === productId ? { ...p, quantity: newQuantity } : p));

    this.basket.set(newItems);
    this.syncToStorage(newItems);
    return true;
  }

  getBasketItems(): IProduct[] {
    return this.basket();
  }

  addToBasket(product: IProduct) {
    const exists = this.basket().some((item) => item.id === product.id);

    if (exists) {
      this.updateQuantity(product.id, 1);
      this.toast.success(`Another ${product.name} added to your cart`);
      return;
    }

    const newItems = [...this.basket(), { ...product, quantity: 1 }];
    this.basket.set(newItems);
    this.syncToStorage(newItems);
    this.toast.success(`${product.name} added to your cart`);
  }

  private syncToStorage(items: IProduct[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Could not save basket', e);
    }
  }

  private loadBasketFromStorage() {
    let rawData: string | null = null;
    try {
      rawData = localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (!rawData) return;
    try {
      const data = JSON.parse(rawData);
      this.basket.set(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error parsing storage. Clearing corrupted data.', e);
      localStorage.removeItem(STORAGE_KEY);
      this.basket.set([]);
    }
  }
}
