// src/app/pages/basketPage/basketItem/basketItem.component.ts
// src/app/basketItem/basketItem.component.ts
import { Component, input, inject, computed } from '@angular/core';
import { IProduct } from '../../../models/interface';
import { CommonModule } from '@angular/common';
import { NumberFormat, QuantityAction } from '../../../models/enum';
import { LocalStorageService } from '../../../services/localstorageService/localStorageService';

@Component({
  selector: 'app-basket-item',
  imports: [CommonModule],
  templateUrl: 'basketItem.component.html',
  styleUrl: 'basketItem.component.scss',
})
export class BasketItemComponent {
  private localStorageService = inject(LocalStorageService);

  itemInp = input.required<IProduct>();
  quantity = computed(() => this.itemInp().quantity ?? 1);
  numberFormat = NumberFormat;
  quantityAction = QuantityAction;

  updateCount(delta: number): void {
    this.localStorageService.updateQuantity(this.itemInp().id, delta);
  }

  remove(): void {
    this.localStorageService.removeFromBasket(this.itemInp().id);
  }
}
