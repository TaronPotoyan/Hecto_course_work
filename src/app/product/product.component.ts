// src/app/product/product.component.ts
import { Component, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IProduct } from '../models/interface';
import { ProductActionType } from '../models/type';
import * as Enums from '../models/enum';

import { LocalStorageService } from '../services/localstorageService/localStorageService';
import { NavigatorService } from '../services/navigatorService/navigatorService';
import { ToastService } from '../services/toastService/toastService';
import { TranslatePipe } from '../i18n/translate.pipe';
import { LanguageService } from '../services/languageService/languageService';

@Component({
  selector: 'app-product',
  imports: [TranslatePipe, CommonModule],
  templateUrl: 'product.component.html',
  styleUrl: 'product.component.scss',
})
export class ProductComponent {
  private navService = inject(NavigatorService);
  private localStorageService = inject(LocalStorageService);
  private toast = inject(ToastService);
  private languageService = inject(LanguageService);

  readonly productType = Enums.ProductDescription;
  readonly dateFormat = Enums.DateFormat;
  readonly productActions = [
    { type: Enums.ProductAction.Basket, iconUrl: Enums.ProductActionIcons.BasketIcon },
    { type: Enums.ProductAction.Like, iconUrl: Enums.ProductActionIcons.LikeIcon },
    { type: Enums.ProductAction.Zoom, iconUrl: Enums.ProductActionIcons.ZoomIcon },
  ];

  product = input.required<IProduct>();
  typeProduct = input<string>('Tech');
  isHovered = signal(false);
  numberFormat = Enums.NumberFormat;
  isZoomed = signal(false);

  onHover(state: boolean) {
    this.isHovered.set(state);
  }

  viewDetailes() {
    const id = this.product().id.toString();
    this.navService.handleNavigate(Enums.AppRoutes.Products, id);
  }

  handleProductAction(actionType: ProductActionType) {
    if (actionType === Enums.ProductAction.Basket) {
      this.addToBasket(this.product());
      return;
    }

    if (actionType === Enums.ProductAction.Like) {
      this.toast.show(
        this.languageService.translate('{name} added to your wishlist', {
          name: this.product().name,
        }),
      );
      return;
    }

    if (actionType === Enums.ProductAction.Zoom) {
      this.toggleZoom(!this.isZoomed());
    }
  }

  toggleZoom(show: boolean) {
    this.isZoomed.set(show);
  }

  private addToBasket(item: IProduct) {
    this.localStorageService.addToBasket(item);
  }
}
