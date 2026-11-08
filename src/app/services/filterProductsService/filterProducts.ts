// src/app/services/filterProductsService/filterProducts.ts
// src/app/services/FilterProductsService/filterProducts.ts
import { inject, Injectable } from '@angular/core';
import {
  CatgeroiesType,
  DiscountProcentType,
  RatingType,
  PriceType,
  BrendType,
} from '../../models/type';
import { IFilterSettings, IProduct } from '../../models/interface';
import { DataBase } from '../dataBaseService/dataBase';

@Injectable({
  providedIn: 'root',
})
export class FilterProducts {
  private products!: IProduct[];
  private dbService = inject(DataBase);

  constructor() {
    this.products = this.dbService.getProducts();
  }

  filterProductsByName(name: string): boolean | number {
    name = name.toLowerCase().trim();
    if (!name) {
      return false;
    }
    return this.products.findIndex((p) => p.name.toLowerCase().trim().startsWith(name));
  }
  
  filterProducts(filterObj: IFilterSettings): IProduct[] {
    return this.products.filter(
      (p) =>
        this.matchesBrand(p, filterObj.productBrand) &&
        this.matchesDiscount(p, filterObj.discountOffer) &&
        this.matchesRating(p, filterObj.rating) &&
        this.matchesCategory(p, filterObj.categories) &&
        this.matchesPrice(p, filterObj.price),
    );
  }

  private matchesBrand(product: IProduct, brands: BrendType[]): boolean {
    if (!brands.length) return true;
    return brands.includes(product.brand!);
  }

  private matchesDiscount(product: IProduct, discounts: DiscountProcentType[]): boolean {
    if (!discounts.length) return true;
    return discounts.includes(product.discountOffer!);
  }

  private matchesRating(product: IProduct, ratings: RatingType[]): boolean {
    if (!ratings.length) return true;
    return ratings.includes(product.rating as RatingType);
  }

  private matchesCategory(product: IProduct, categories: CatgeroiesType[]): boolean {
    console.log(categories);
    if (!categories.length) return true;
    return categories.includes(product.category!);
  }

  private matchesPrice(product: IProduct, prices: PriceType[]): boolean {
    if (!prices.length) return true;
    return prices.some(
      ([min, max]) => product.currentPrice >= min && (max === null || product.currentPrice <= max),
    );
  }
}
