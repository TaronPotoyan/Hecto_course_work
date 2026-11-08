// src/app/services/filterProductsService/filterProducts.ts
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
  private dbService = inject(DataBase);

  /** Returns the id of the first product whose name starts with `name`, or null. */
  findProductIdByName(name: string): number | null {
    const query = name.toLowerCase().trim();
    if (!query) return null;
    const match = this.dbService
      .getProducts()
      .find((p) => p.name.toLowerCase().trim().startsWith(query));
    return match ? match.id : null;
  }

  filterProducts(filterObj: IFilterSettings): IProduct[] {
    return this.dbService
      .getProducts()
      .filter(
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
    return !!product.brand && brands.includes(product.brand);
  }

  private matchesDiscount(product: IProduct, discounts: DiscountProcentType[]): boolean {
    if (!discounts.length) return true;
    return !!product.discountOffer && discounts.includes(product.discountOffer);
  }

  private matchesRating(product: IProduct, ratings: RatingType[]): boolean {
    if (!ratings.length) return true;
    return ratings.includes(product.rating as RatingType);
  }

  private matchesCategory(product: IProduct, categories: CatgeroiesType[]): boolean {
    if (!categories.length) return true;
    return !!product.category && categories.includes(product.category);
  }

  private matchesPrice(product: IProduct, prices: PriceType[]): boolean {
    if (!prices.length) return true;
    return prices.some(
      ([min, max]) => product.currentPrice >= min && (max === null || product.currentPrice <= max),
    );
  }
}
