// src/app/helpers/helperClass.ts

import * as Enums from '../../app/models/enum';
import * as Interfaces from '../../app/models/interface';

export class Helper {
  static getSocialMedias() {
    return Object.values(Enums.SocialMedia).map((name) => ({
      mediaName: name,
      link: Enums.SocialMediaLinks[name],
    }));
  }

  static getFooterSections(): Interfaces.IFooterSection[] {
    const titles = Object.values(Enums.FooterSectionTitle);
    const links = Object.values(Enums.FooterSectionTitleLinks);

    return titles.map((title, index) => ({
      title,
      links: links[index].split(', ').map((link) => link.trim()),
    }));
  }

  static getMenuOptions(): Interfaces.IMenuOption[] {
    const optionNames = Object.values(Enums.MenuOptions);
    const optionImgs = Object.values(Enums.MenuOptionsImgs);

    return optionNames.map((name, index) => ({
      optionName: name,
      optionImg: optionImgs[index],
    }));
  }

  static getRouteMenu() {
    return [
      { label: Enums.RouteMenuEnum.Heckto, route: Enums.AppRoutes.Home },
      { label: Enums.RouteMenuEnum.Home, route: Enums.AppRoutes.Home },
      { label: Enums.RouteMenuEnum.Products, route: Enums.AppRoutes.Products },
      { label: Enums.RouteMenuEnum.Blog, route: Enums.AppRoutes.Blog },
      { label: Enums.RouteMenuEnum.Contact, route: Enums.AppRoutes.Contact },
    ];
  }

  static getDiscountExtensionText() {
    return Object.values(Enums.DiscountExtensionText);
  }
  static getUniqueInfoCons() {
    return Object.values(Enums.UniqueInfoCons);
  }

  static getProductActions() {
    const actions = Object.values(Enums.ProductAction);
    const actionsImgUrls = Object.values(Enums.ProductActionIcons);
    const result: Interfaces.IProductAction[] = [];
    actions.forEach((action, index) => {
      result.push({
        type: action,
        iconUrl: actionsImgUrls[index],
      });
    });
    return result;
  }

  static getNavItems() {
    const navItems = [
      { name: 'New Arrival', link: '/new-arrival' },
      { name: 'Best Seller', link: '/best-seller' },
      { name: 'Featured', link: '/featured' },
      { name: 'Special Offer', link: '/special-offer' },
    ];
    return navItems;
  }
  static getDiscountNavItems() {
    const discountNavItems = [
      { name: 'HeadPhones', link: '/', type: 'HeadPhone' },
      { name: 'LapTop ', link: '/', type: 'LapTop' },
      { name: 'Other', link: '/', type: 'Other' },
    ];
    return discountNavItems;
  }
  static getBrandOptions() {
    const values = Object.values(Enums.BrandNames);
    const result: Interfaces.IBrandDescription[] = [];
    values.forEach((brend) => {
      const brendDescription = {
        id: brend.toLowerCase(),
        lable: brend,
        value: brend,
      };
      result.push(brendDescription);
    });
    return result;
  }
  static getBrendNames() {
    return Object.values(Enums.BrandNames);
  }

  static getDiscountOffer(): Interfaces.IBrandDescription[] {
    return [
      { id: '5', value: 5, lable: '5%' },
      { id: '20', value: 20, lable: '20%' },
      { id: '25', value: 25, lable: '25%' },
    ];
  }

  static getCategories(): Interfaces.ICategories[] {
    return [
      { id: 'cat-watches', label: 'Watches', value: 'Watches' },
      { id: 'cat-headphones', label: 'Headphones', value: 'Headphones' },
      { id: 'cat-laptop', label: 'Laptop', value: 'Laptop' },
      { id: 'cat-game', label: 'Game Console', value: 'Game Console' },
      { id: 'cat-jewellery', label: 'Jewellery', value: 'Jewellery' },
      { id: 'cat-perfume', label: 'Perfume', value: 'Perfume' },
    ];
  }

  static getRatings(): boolean[][] {
    return [
      [true, true, true, true, true],
      [true, true, true, true, false],
      [true, true, true, false, false],
      [true, true, false, false, false],
      [true, false, false, false, false],
    ];
  }

  static getPriceRanges() {
    return [
      { id: 'p1', label: '$0 - $150', min: 0, max: 150 },
      { id: 'p2', label: '$150 - $350', min: 150, max: 350 },
      { id: 'p3', label: '$350 - $500', min: 350, max: 500 },
      { id: 'p4', label: '$550 - $800', min: 550, max: 800 },
      { id: 'p5', label: '$800+', min: 800, max: null },
    ];
  }

  static getFilterGroups(): Interfaces.IFilterGroupConfig[] {
    return [
      {
        title: 'Product Brand',
        type: Enums.FilterBy.ProductBrand,
        options: this.getBrandOptions(),
      },
      {
        title: 'Discount offer',
        type: Enums.FilterBy.DiscountOffer,
        options: this.getDiscountOffer(),
      },
      { title: 'Rating', type: Enums.FilterBy.Rating, options: this.getRatings() },
      { title: 'Categories', type: Enums.FilterBy.Categories, options: this.getCategories() },
      { title: 'Price Filter', type: Enums.FilterBy.PriceFilter, options: this.getPriceRanges() },
    ];
  }

  static getCartFormInfo(): Interfaces.IFormInput[] {
    return [
      {
        name: Enums.CartFormField.CardNumber,
        placeholder: '1234 5678 9012 3456',
        type: 'text',
        labelValue: 'Card Number',
        maxlength: '19',
      },
      {
        name: Enums.CartFormField.ExpDate,
        placeholder: 'MM/YY',
        type: 'text',
        labelValue: 'Expiration Date',
        maxlength: '5',
      },
      {
        name: Enums.CartFormField.CVV,
        placeholder: '123',
        type: 'text',
        labelValue: 'CVV',
        maxlength: '3',
      },
      {
        name: Enums.CartFormField.HolderName,
        placeholder: 'John Doe',
        type: 'text',
        labelValue: 'Card Holder Name',
        maxlength: '',
      },
    ];
  }

  static readonly defaultStarCount = 5;

  static getProductDetailsNav(): Interfaces.IProductNav[] {
    return [
      { className: 'active', value: Enums.ProductDetailTab.Description },
      { className: '', value: Enums.ProductDetailTab.AdditionalInfo },
      { className: '', value: Enums.ProductDetailTab.Reviews },
      { className: '', value: Enums.ProductDetailTab.Video },
    ];
  }

  static getProductMoreDetailsInfo(): string[] {
    return new Array(4).fill(Enums.ProductMoreDetails.TEXT);
  }
  static shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
  }
}
