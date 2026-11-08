// src/app/header/header.component.ts
import {
  Component,
  signal,
  inject,
  computed,
  effect,
  ElementRef,
  HostListener,
  DestroyRef,
} from '@angular/core';
import { DiscountComponent } from './discount.component/discount.component';
import { IMenuOption } from '../models/interface';
import { FormsModule } from '@angular/forms';
import { FilterProducts } from '../services/filterProductsService/filterProducts';
import { NavigatorService } from '../services/navigatorService/navigatorService';
import { DataBase } from '../services/dataBaseService/dataBase';
import { LocalStorageService } from '../services/localstorageService/localStorageService';
import { ThemeService } from '../services/themeService/themeService';
import { ToastService } from '../services/toastService/toastService';
import { AuthService } from '../services/authService/authService';
import {
  LanguageCode,
  LanguageService,
  LANGUAGE_OPTIONS,
} from '../services/languageService/languageService';
import { ActiveDropdownType } from '../models/type';
import { MenuOptions, Currencies, AppRoutes, RouteMenuEnum, ThemeMode } from '../models/enum';
import { Helper } from '../helpers/helperClass';
import { TranslatePipe } from '../i18n/translate.pipe';

const THEME_LABELS: Record<ThemeMode, string> = {
  [ThemeMode.Light]: '☀ Light',
  [ThemeMode.Dark]: '☾ Dark',
  [ThemeMode.System]: '◐ System',
};

@Component({
  selector: 'app-header',
  imports: [TranslatePipe, DiscountComponent, FormsModule],
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.scss',
})
export class HeaderComponent {
  private navService = inject(NavigatorService);
  private filterService = inject(FilterProducts);
  private dbService = inject(DataBase);
  private eRef = inject(ElementRef);
  private toast = inject(ToastService);
  protected basket = inject(LocalStorageService);
  protected theme = inject(ThemeService);
  protected auth = inject(AuthService);
  protected languageService = inject(LanguageService);

  readonly currentUrl = this.navService.currentUrl();
  readonly menuOptions = Helper.getMenuOptions();
  readonly navItems = Helper.getRouteMenu();
  readonly routeMenue = RouteMenuEnum;
  readonly themeLabels = THEME_LABELS;

  selectedCurrency = signal<string>(Currencies.USD);
  searchQuery = signal('');
  activeDropdown = signal<ActiveDropdownType>('none');
  mobileMenuOpen = signal(false);
  currentIndex = signal<number>(0);

  readonly discountes = computed(() => this.dbService.getDiscountedProducts());

  readonly dropdownConfigs = computed(() => [
    {
      id: 'lang' as const,
      label: this.languageService.labelFor(this.languageService.language()),
      data: LANGUAGE_OPTIONS.map((o) => o.code) as string[],
    },
    {
      id: 'curr' as const,
      label: this.selectedCurrency(),
      data: Object.values(Currencies) as string[],
    },
    {
      id: 'theme' as const,
      label: this.languageService.translate(THEME_LABELS[this.theme.mode()]),
      data: Object.values(ThemeMode) as string[],
    },
  ]);

  readonly showHero = computed(() => {
    const url = this.currentUrl().split('?')[0];
    return url === '/' || url === `/${AppRoutes.HomeAlias}`;
  });

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    effect(() => {
      if (this.showHero() && this.discountes().length > 1) {
        this.startAutoSlide();
      } else {
        this.stopAutoSlide();
      }
    });

    // Close the mobile menu after navigating
    effect(() => {
      this.currentUrl();
      this.mobileMenuOpen.set(false);
    });

    inject(DestroyRef).onDestroy(() => this.stopAutoSlide());
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    if (this.activeDropdown() !== 'none' && !this.eRef.nativeElement.contains(event.target)) {
      this.activeDropdown.set('none');
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.activeDropdown.set('none');
    this.mobileMenuOpen.set(false);
  }

  toggleDropdown(menu: ActiveDropdownType) {
    this.activeDropdown.update((prev) => (prev === menu ? 'none' : menu));
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((open) => !open);
  }

  dropdownItemLabel(menuId: ActiveDropdownType, item: string): string {
    if (menuId === 'theme') return this.languageService.translate(THEME_LABELS[item as ThemeMode]);
    if (menuId === 'lang') return this.languageService.labelFor(item as LanguageCode);
    return item;
  }

  isSelected(menuId: ActiveDropdownType, item: string): boolean {
    if (menuId === 'lang') return this.languageService.language() === item;
    if (menuId === 'curr') return this.selectedCurrency() === item;
    return this.theme.mode() === item;
  }

  selectItem(menuId: ActiveDropdownType, value: string) {
    if (menuId === 'lang') this.languageService.setLanguage(value as LanguageCode);
    else if (menuId === 'curr') this.selectedCurrency.set(value);
    else if (menuId === 'theme') this.theme.setMode(value as ThemeMode);
    this.activeDropdown.set('none');
  }

  toggleSlide(isNext: boolean) {
    const len = this.discountes().length;
    if (len <= 1) return;
    const step = isNext ? 1 : -1;
    this.currentIndex.update((i) => (i + step + len) % len);
  }

  getTransform(): string {
    return `translateX(-${this.currentIndex() * 100}%)`;
  }

  isActiveNav(route: string, label: string): boolean {
    if (label === RouteMenuEnum.Heckto) return false;
    const url = this.currentUrl().split('?')[0];
    if (route === AppRoutes.Home || route === AppRoutes.HomeAlias) {
      return url === '/' || url === `/${AppRoutes.HomeAlias}`;
    }
    return url === `/${route}` || url.startsWith(`/${route}/`);
  }

  handleNavigation(path: string, params?: string) {
    if (path === AppRoutes.Heckto) path = AppRoutes.Home;
    this.navService.handleNavigate(path, params);
  }

  handleMenuOption(option: IMenuOption) {
    if (option.optionName === MenuOptions.Wishings) {
      this.toast.show('Wishlist is coming soon');
      return;
    }
    this.handleNavigation(option.optionName);
  }

  menuOptionLabel(option: IMenuOption): string {
    if (option.optionName === MenuOptions.Basket) return '';
    if (option.optionName === MenuOptions.Login && this.auth.user()) {
      return this.auth.user()!.name;
    }
    return this.languageService.translate(option.optionName);
  }

  isBasket(option: IMenuOption): boolean {
    return option.optionName === MenuOptions.Basket;
  }

  goToSlide(index: number) {
    this.currentIndex.set(index);
    this.startAutoSlide();
  }

  handleSearch() {
    const name = this.searchQuery();
    if (!name.trim()) return;
    const id = this.filterService.findProductIdByName(name);
    if (id === null) {
      this.toast.error(
        this.languageService.translate('No product found for "{name}"', { name: name.trim() }),
      );
      return;
    }
    this.searchQuery.set('');
    this.handleNavigation(AppRoutes.Products, id.toString());
  }

  private startAutoSlide() {
    this.stopAutoSlide();
    if (typeof window === 'undefined') return; // no timers during SSR
    this.intervalId = setInterval(() => this.toggleSlide(true), 4000);
  }

  private stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
