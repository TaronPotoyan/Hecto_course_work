// src/app/pages/productPage/shopProduct/shopProduct.component.ts
// src/app/shopProduct/shopProduct.component.ts
import { Component, inject, input, signal } from '@angular/core';
import { IProduct } from '../../../models/interface';
import { CurrencyPipe, NgClass } from '@angular/common';
import { LocalStorageService } from '../../../services/localstorageService/localStorageService';
import { LayoutType } from '../../../models/type';
import { AppRoutes, ProductAction } from '../../../models/enum';
import { NavigatorService } from '../../../services/navigatorService/navigatorService';
import { ToastService } from '../../../services/toastService/toastService';
import { TranslatePipe } from '../../../i18n/translate.pipe';
import { LanguageService } from '../../../services/languageService/languageService';

@Component({
  selector: 'app-shop-product',
  imports: [TranslatePipe, CurrencyPipe, NgClass],
  templateUrl: 'shopProduct.component.html',
  styleUrl: 'shopProduct.component.scss',
})
export class ShopProduct {
  private localStorageService = inject(LocalStorageService);
  private navService = inject(NavigatorService);
  private toast = inject(ToastService);
  private languageService = inject(LanguageService);

  readonly ratingsArr = new Array(5).fill(0).map((_, i) => i + 1);
  readonly productActions = ProductAction;

  layout = input.required<LayoutType>();
  product = input.required<IProduct>();
  isZoomed = signal(false);

  viewDetails() {
    this.navService.handleNavigate(AppRoutes.Products, this.product().id.toString());
  }

  handleAction(actionType: string) {
    if (actionType === ProductAction.Basket) {
      this.localStorageService.addToBasket(this.product());
    }

    if (actionType === ProductAction.Like) {
      this.toast.show(
        this.languageService.translate('{name} added to your wishlist', {
          name: this.product().name,
        }),
      );
    }

    if (actionType === ProductAction.Zoom) {
      this.toggleZoom(true);
    }
  }

  toggleZoom(show: boolean) {
    this.isZoomed.set(show);
  }
}
