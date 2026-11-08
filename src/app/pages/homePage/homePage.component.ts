// src/app/pages/homePage/homePage.component.ts
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataBase } from '../../services/dataBaseService/dataBase';
import { IProduct, IProductAction } from '../../models/interface';
import { ProductComponent } from '../../product/product.component';
import { AppRoutes, ProductAction } from '../../models/enum';
import { CycleProductComponent } from '../../cycleProduct/cycleProduct.component';
import { Helper } from '../../helpers/helperClass';
import { LocalStorageService } from '../../services/localstorageService/localStorageService';
import { ToastService } from '../../services/toastService/toastService';
import { SubscribeService } from '../../services/subscribeService/subscribeService';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { LanguageService } from '../../services/languageService/languageService';

const UNIQUE_PRODUCT_ID = 7;

@Component({
  selector: 'app-home.component',
  imports: [TranslatePipe, ProductComponent, CurrencyPipe, CycleProductComponent, FormsModule],
  templateUrl: './homePage.component.html',
  styleUrl: './homePage.component.scss',
})
export class HomePageComponent {
  protected dbService = inject(DataBase);
  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);
  private toast = inject(ToastService);
  private languageService = inject(LanguageService);
  private subscribeService = inject(SubscribeService);

  readonly productAction = ProductAction;
  readonly extentionsDiscountItems = Helper.getDiscountExtensionText();
  readonly navItems = Helper.getNavItems();
  readonly discountNavItems = Helper.getDiscountNavItems();
  readonly productActions: IProductAction[] = Helper.getProductActions();
  readonly uniqueInfoCons = Helper.getUniqueInfoCons();

  featuredDots = signal([true, false, false, false]);
  categoryDots = signal([true, false, false]);
  isZoomed = signal(false);
  url = signal('');
  activeNavIndex = signal(0);
  activeDiscountNavIndex = signal(0);
  newsletterEmail = signal('');

  // linkedSignal: recomputed when API data arrives, but can still be reshuffled locally.
  featurdProducts = linkedSignal(() => this.dbService.getFeaturedProducts());
  leastestProducts = linkedSignal(() => this.dbService.getFirstN(6));
  topCategories = linkedSignal(() => this.dbService.getTopCategories());

  readonly chaire = computed(() => this.dbService.getProductById(UNIQUE_PRODUCT_ID));
  readonly trandProducts = computed(() => this.dbService.getTrendProducts());
  readonly homes = computed(() => this.dbService.getHomes());
  readonly activeDiscount = computed(() => {
    const type = this.discountNavItems[this.activeDiscountNavIndex()].type;
    return this.dbService.getDiscountedProducts().find((p) => p.type === type) ?? null;
  });

  setActiveNav(index: number) {
    this.activeNavIndex.set(index);
    this.leastestProducts.set(Helper.shuffleArray(this.dbService.getFirstN(6)));
  }

  seeItem(item: IProduct) {
    this.router.navigate(['/', AppRoutes.Products, item.id]);
  }

  setActiveDiscountNav(index: number) {
    this.activeDiscountNavIndex.set(index);
  }

  featuredDotClick(index: number) {
    this.featurdProducts.set(Helper.shuffleArray(this.featurdProducts()));
    this.featuredDots.set(this.featuredDots().map((_, i) => i === index));
  }

  categoryDotClick(index: number) {
    this.topCategories.set(Helper.shuffleArray(this.topCategories()));
    this.categoryDots.set(this.categoryDots().map((_, i) => i === index));
  }

  handleAction(type: string, product: IProduct | null): void {
    if (!product) return;
    if (type === ProductAction.Basket) return this.localStorageService.addToBasket(product);
    if (type === ProductAction.Like)
      return this.toast.show(
        this.languageService.translate('{name} added to your wishlist', { name: product.name }),
      );
    if (type === ProductAction.Zoom) return this.handleZoom(true, product);
  }

  handleZoom(show: boolean, item: IProduct | null = null) {
    this.isZoomed.set(show);
    if (item) this.url.set(item.url);
  }

  shopNow() {
    const promo = this.activeDiscount();
    if (promo) this.router.navigate(['/', AppRoutes.Products, promo.id]);
  }

  async subscribe() {
    if (await this.subscribeService.subscribe(this.newsletterEmail())) {
      this.newsletterEmail.set('');
    }
  }
}
