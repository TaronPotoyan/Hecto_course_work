// src/app/cycleProduct/cycleProduct.component.ts
import { Component, inject, input, signal } from '@angular/core';
import { IProduct } from '../models/interface';
import { NavigatorService } from '../services/navigatorService/navigatorService';
import { AppRoutes } from '../models/enum';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'app-cycle-product-component',
  imports: [TranslatePipe],
  templateUrl: 'cycleProduct.component.html',
  styleUrl: 'cycleProduct.component.scss',
})
export class CycleProductComponent {
  private navService = inject(NavigatorService);

  hovered = signal(false);
  product = input.required<IProduct>();

  /** Top categories aren't catalog items, so open the shop instead of a product page. */
  viewDetails() {
    this.navService.handleNavigate(AppRoutes.Products);
  }

  onHover(state: boolean) {
    this.hovered.set(state);
  }
}
