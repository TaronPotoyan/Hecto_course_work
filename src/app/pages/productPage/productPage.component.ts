// src/app/pages/productPage/productPage.component.ts
import { Component, computed, effect, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';

import { IFilterSettings, IPriceRange } from '../../models/interface';
import { DataBase } from '../../services/dataBaseService/dataBase';
import { ShopProduct } from './shopProduct/shopProduct.component';
import { LayoutType, PriceType } from '../../models/type';
import { FilterProducts } from '../../services/filterProductsService/filterProducts';
import { FilterBy, ProductLayout, SortBy, ViewMode } from '../../models/enum';
import { Helper } from '../../helpers/helperClass';
import { TranslatePipe } from '../../i18n/translate.pipe';

const EMPTY_FILTERS: IFilterSettings = {
  productBrand: [],
  discountOffer: [],
  rating: [],
  categories: [],
  price: [],
};

const FILTER_KEYS: Partial<Record<FilterBy, keyof IFilterSettings>> = {
  [FilterBy.ProductBrand]: 'productBrand',
  [FilterBy.DiscountOffer]: 'discountOffer',
  [FilterBy.Rating]: 'rating',
  [FilterBy.Categories]: 'categories',
  [FilterBy.PriceFilter]: 'price',
};

@Component({
  selector: 'app-product-page',
  imports: [TranslatePipe, NgClass, ShopProduct],
  templateUrl: './productPage.component.html',
  styleUrl: './productPage.component.scss',
})
export class ProductPageComponent {
  private filterService = inject(FilterProducts);
  protected dbService = inject(DataBase);

  readonly filterBy = FilterBy;
  readonly filterGroups = Helper.getFilterGroups();
  readonly viewModes = ViewMode;
  readonly layoutType = ProductLayout;
  readonly sortOptions = SortBy;

  viewMode = signal<LayoutType>(ProductLayout.grid);
  sortBy = signal<string>(SortBy.HighToLow);
  pageNum = signal(1);
  perPage = signal(10);
  filters = signal<IFilterSettings>(EMPTY_FILTERS);
  filtersOpen = signal(false);

  readonly filteredProducts = computed(() => {
    this.dbService.getProducts(); // re-run when catalog loads
    const list = [...this.filterService.filterProducts(this.filters())];
    const dir = this.sortBy() === SortBy.LowToHigh ? 1 : -1;
    return list.sort((a, b) => (a.currentPrice - b.currentPrice) * dir);
  });

  readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredProducts().length / this.perPage())),
  );
  readonly perPageArr = computed(() => Array.from({ length: this.pageCount() }, (_, i) => i + 1));
  readonly productes = computed(() => {
    const start = (this.pageNum() - 1) * this.perPage();
    return this.filteredProducts().slice(start, start + this.perPage());
  });
  readonly activeFilterCount = computed(() =>
    Object.values(this.filters()).reduce((acc, list) => acc + list.length, 0),
  );

  constructor() {
    // Keep the current page in range when filters shrink the result set
    effect(() => {
      if (this.pageNum() > this.pageCount()) this.pageNum.set(this.pageCount());
    });
  }

  /** Value stored in the filter for a checkbox option. */
  optionValue(option: { value?: unknown } & Partial<IPriceRange>, type: FilterBy): unknown {
    if (type === FilterBy.PriceFilter) return [option.min ?? 0, option.max ?? null] as PriceType;
    return option.value;
  }

  isChecked(value: unknown, type: FilterBy): boolean {
    const key = FILTER_KEYS[type];
    if (!key) return false;
    return (this.filters()[key] as unknown[]).some((v) => this.sameValue(v, value));
  }

  toggleSelection(value: unknown, type: FilterBy) {
    const key = FILTER_KEYS[type];
    if (!key) return;
    this.filters.update((current) => {
      const list = current[key] as unknown[];
      const next = list.some((v) => this.sameValue(v, value))
        ? list.filter((v) => !this.sameValue(v, value))
        : [...list, value];
      return { ...current, [key]: next };
    });
    this.pageNum.set(1);
  }

  clearFilters() {
    this.filters.set(EMPTY_FILTERS);
    this.pageNum.set(1);
  }

  goToPage(to: number) {
    const count = this.pageCount();
    if (to > count) this.pageNum.set(1);
    else if (to <= 0) this.pageNum.set(count);
    else this.pageNum.set(to);
  }

  toggleView(mode: LayoutType): void {
    this.viewMode.set(mode);
  }

  onSortChange(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value);
    this.pageNum.set(1);
  }

  onPerPageChange(event: Event): void {
    this.perPage.set(Number((event.target as HTMLSelectElement).value));
    this.pageNum.set(1);
  }

  private sameValue(a: unknown, b: unknown): boolean {
    if (Array.isArray(a) && Array.isArray(b)) return a[0] === b[0] && a[1] === b[1];
    return a === b;
  }
}
