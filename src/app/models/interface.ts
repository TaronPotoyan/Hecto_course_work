// src/app/models/interface.ts
// src/Models/interface.ts
import { FilterBy } from './enum';
import {
  ProductType,
  BrendType,
  DiscountProcentType,
  CatgeroiesType,
  DiscountType,
  RatingType,
  PriceType,
  FilterOptionsType,
  ProductActionType,
} from './type';

export interface IProduct {
  owner?: string;
  date?: Date;
  title?: string;
  _id?: number;
  id: number;
  name: string;
  currentPrice: number;
  originalPrice: number;
  rating: number;
  description: string;
  url: string;
  type: ProductType;
  quantity?: number;
  brand?: BrendType;
  discountOffer?: DiscountProcentType;
  category?: CatgeroiesType;
}

export interface IDiscountProduct {
  smallTitle: string;
  title: string;
  paragraph: string;
  _id: number;
  imgUrl: string;
  id: number;
  type: DiscountType;
}

export interface IFilterSettings {
  productBrand: BrendType[];
  discountOffer: DiscountProcentType[];
  rating: RatingType[];
  categories: CatgeroiesType[];
  price: PriceType[];
}

export interface IBrandDescription {
  id: string;
  lable: string;
  value: any | string;
}

export interface ICategories {
  label: CatgeroiesType;
  value: CatgeroiesType;
  id: string;
}

export interface IPriceRange {
  id: string;
  label: string;
  min?: number;
  max?: number | null;
}

export interface IFilterGroupConfig {
  title: string;
  type: FilterBy;
  options: FilterOptionsType;
}

export interface IFooterSection {
  title: string;
  links: string[];
}

export interface IMenuOption {
  optionName: string;
  optionImg: string;
}

export interface IProductAction {
  type: ProductActionType;
  iconUrl: string;
}

export interface IFormInput {
  name: string;
  placeholder: string;
  type: string;
  labelValue: string;
  maxlength: string;
}

export interface IProductNav {
  className: string;
  value: string;
}

export interface IDiscountNavItem {
  name: string;
  link: string;
  type: string;
}
