// src/app/models/type.ts
// src/Models/type.ts
import { IBrandDescription, ICategories, IPriceRange } from './interface';

export type ProductType = 'Tech' | 'Fashion' | 'Home' | 'Beauty' | 'Sports' | 'Trend';
export type DiscountType = 'HeadPhone' | 'LapTop' | 'Other';
export type ProductActionType = 'Basket' | 'Zoom' | 'Like';
export type LayoutType = 'grid' | 'list';
export type BrendType = 'Apple' | 'Sony' | 'Nike' | 'Casio' | 'Vke' | 'Glassiness';
export type DiscountProcentType = 20 | 5 | 25;
export type RatingType = 1 | 2 | 3 | 4 | 5;
export type CatgeroiesType =
  | 'Watches'
  | 'Headphones'
  | 'Laptop'
  | 'Game Console'
  | 'Clothe'
  | 'Jewellery'
  | 'Other'
  | 'Perfume';

export type PriceType = [0, 150] | [150, 350] | [350, 500] | [550, 800] | [800, null];
export type ActiveDropdownType = 'lang' | 'curr' | 'theme' | 'none';
export type FilterOptionsType = IBrandDescription[] | boolean[][] | ICategories[] | IPriceRange[];
