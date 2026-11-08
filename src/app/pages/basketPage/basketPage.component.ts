// src/app/pages/basketPage/basketPage.component.ts
// src/pages/basketPage/basketPage.component.ts
import { Component, computed, inject } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { LocalStorageService } from '../../services/localstorageService/localStorageService';
import { AppRoutes, NumberFormat } from '../../models/enum';
import { BasketItemComponent } from './basketItem/basketItem.component';
import { NavigatorService } from '../../services/navigatorService/navigatorService';
import { ToastService } from '../../services/toastService/toastService';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  selector: 'app-basket',
  templateUrl: './basketPage.component.html',
  styleUrl: './basketPage.component.scss',
  imports: [TranslatePipe, BasketItemComponent, DecimalPipe, NgClass],
})
export class BasketPageComponent {
  private localStorageService = inject(LocalStorageService);
  private navService = inject(NavigatorService);
  private toast = inject(ToastService);

  readonly SHIPPING_COST = 100;
  readonly items = this.localStorageService.getBasketSignal();
  readonly subtotal = computed(() =>
    this.items().reduce((acc, item) => acc + item.currentPrice * (item.quantity ?? 1), 0),
  );
  readonly totalWithShipping = computed(() => {
    const sub = this.subtotal();
    return sub > 0 ? sub + this.SHIPPING_COST : 0;
  });
  readonly summaryTable = computed(() => [
    { title: 'Subtotal', className: 'subtotal', value: this.subtotal() },
    { title: 'Total', className: 'total', value: this.totalWithShipping() },
  ]);
  readonly numberFormat = NumberFormat;

  async clearCart() {
    const ok = await this.toast.confirm(
      'All items will be removed from your cart.',
      'Clear your cart?',
      'Yes, clear it',
    );
    if (ok) this.localStorageService.clearBasket();
  }

  checkout() {
    this.toast.show('Checkout is coming soon. Use "Buy Now" on a product page to pay by card.');
  }

  startShopping() {
    this.navService.handleNavigate(AppRoutes.Products);
  }
}
