// src/app/services/DataBaseService/dataBase.ts
import { Injectable } from '@angular/core';
import { IDiscountProduct } from '../../models/interface';
import { DISCOUNT_PRODUCTS, HOMES, PRODUCTS, TOP_CATEGORIES } from '../../../DB/indexDb';
import { IProduct } from '../../models/interface';
import { FutureProduct } from '../../models/enum';

@Injectable({
  providedIn: 'root',
})
export class DataBase {
  private discountedProducts: IDiscountProduct[] = DISCOUNT_PRODUCTS;
  private products: IProduct[] = PRODUCTS;
  private topCategories: IProduct[] = TOP_CATEGORIES;
  private homes: IProduct[] = HOMES;

  readonly defaultPerPage = 10;

  getProductsInRange(pageNum: number, PerPage = 10): [IProduct[], number] {
    const to = pageNum * PerPage;
    const from = (pageNum - 1) * PerPage;
    return [this.products.slice(from, to), this.getPageCount(PerPage)];
  }

  getPageCount(perPage = 10): number {
    return Math.ceil(this.products.length / perPage);
  }

  getTopCategories(): IProduct[] {
    return this.topCategories;
  }
  getDiscountedProducts(): IDiscountProduct[] {
    return this.discountedProducts;
  }

  getProducts(): IProduct[] {
    return this.products;
  }
  getFirstN(N: number) {
    return this.products.slice(0, N);
  }

  getFeaturedProducts() {
    const firstFoure = 4;
    const featuredPr = this.products
      .filter((pr) => pr.type === FutureProduct.Tech)
      .slice(0, firstFoure);

    return featuredPr;
  }

  getProductById(id: number): null | IProduct {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      return product;
    }
    return null;
  }

  getTrendProducts(): IProduct[] {
    return this.products.filter((pr) => pr.type === FutureProduct.Trend);
  }

  getHomes() {
    return this.homes;
  }
  getSimilarItems(itemName: string): IProduct[] | null {
    const similars: IProduct[] = this.products.filter((item) =>
      item.name.toLowerCase().includes(itemName.slice(3)),
    );
    return similars.slice(0, 3);
  }
}
