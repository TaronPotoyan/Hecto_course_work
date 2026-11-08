// src/app/pages/productDetailsPage/productDetailsPage.component.ts
import { Component, computed, effect, inject, signal, PLATFORM_ID } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { DataBase } from '../../services/dataBaseService/dataBase';
import { LocalStorageService } from '../../services/localstorageService/localStorageService';
import { ToastService } from '../../services/toastService/toastService';
import { ProductComponent } from '../../product/product.component';
import { IFormInput } from '../../models/interface';
import { Helper } from '../../helpers/helperClass';
import { DEFAULT_STAR_COUNT, NumberFormat, ProductDetailTab } from '../../models/enum';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { LanguageService } from '../../services/languageService/languageService';

@Component({
  selector: 'app-product-details-component',
  imports: [TranslatePipe, ProductComponent, DecimalPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './productDetailsPage.component.html',
  styleUrl: './productDetailsPage.component.scss',
})
export class ProductDetailsPageComponent {
  private route = inject(ActivatedRoute);
  protected dbService = inject(DataBase);
  private basket = inject(LocalStorageService);
  private toast = inject(ToastService);
  private languageService = inject(LanguageService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly cartFormInfo: IFormInput[] = Helper.getCartFormInfo();
  readonly tabs = Object.values(ProductDetailTab);
  readonly tab = ProductDetailTab;
  readonly productMoreDetailsInfo = Helper.getProductMoreDetailsInfo();
  readonly numFormat = NumberFormat;

  paymentForm = new FormGroup({
    cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9 ]{12,19}$')]),
    expDate: new FormControl('', [
      Validators.required,
      Validators.pattern('^(0[1-9]|1[0-2])/[0-9]{2}$'),
    ]),
    cvv: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
    holderName: new FormControl('', [Validators.required]),
  });

  private readonly productId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    { initialValue: NaN },
  );

  readonly product = computed(() => this.dbService.getProductById(this.productId()));
  readonly notFound = computed(() => this.dbService.state() === 'ready' && !this.product());
  readonly stars = computed(() =>
    Array.from({ length: DEFAULT_STAR_COUNT }, (_, i) => i < (this.product()?.rating ?? 0)),
  );
  readonly similarItems = computed(() => {
    const product = this.product();
    return product ? this.dbService.getSimilarItems(product) : [];
  });

  activeTab = signal<ProductDetailTab>(ProductDetailTab.Description);
  showCard = signal(false);

  constructor() {
    effect(() => {
      this.productId();
      this.activeTab.set(ProductDetailTab.Description);
      if (this.isBrowser) window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  addToCart() {
    const product = this.product();
    if (product) this.basket.addToBasket(product);
  }

  addToWishlist() {
    const product = this.product();
    if (product)
      this.toast.show(
        this.languageService.translate('{name} added to your wishlist', { name: product.name }),
      );
  }

  openCardForm() {
    this.showCard.set(true);
  }

  onPay() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      this.toast.error('Please fill in all card fields correctly.');
      return;
    }
    this.toast.success('Payment received (demo). Thank you for your order!');
    this.paymentForm.reset();
    this.closeCardForm();
  }

  closeCardForm() {
    this.showCard.set(false);
  }

  isInvalid(name: string): boolean {
    const control = this.paymentForm.get(name);
    return !!control && control.invalid && control.touched;
  }
}
