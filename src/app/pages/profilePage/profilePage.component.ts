// src/app/pages/profilePage/profilePage.component.ts
import { Component, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { AuthService, IUserProfile } from '../../services/authService/authService';
import { LocalStorageService } from '../../services/localstorageService/localStorageService';
import { ToastService } from '../../services/toastService/toastService';
import { ThemeService } from '../../services/themeService/themeService';
import {
  LANGUAGE_OPTIONS,
  LanguageCode,
  LanguageService,
} from '../../services/languageService/languageService';
import { DateFormat, NumberFormat, ThemeMode } from '../../models/enum';

type Tab = 'overview' | 'details' | 'security' | 'preferences';

const DAY_MS = 24 * 60 * 60 * 1000;

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const { newPassword, confirmPassword } = group.value as Record<string, string>;
  return newPassword && confirmPassword && newPassword !== confirmPassword
    ? { mismatch: true }
    : null;
}

@Component({
  selector: 'app-profile-page',
  imports: [TranslatePipe, ReactiveFormsModule, RouterLink, DatePipe, DecimalPipe],
  templateUrl: './profilePage.component.html',
  styleUrl: './profilePage.component.scss',
})
export class ProfilePageComponent {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private toast = inject(ToastService);
  private languageService = inject(LanguageService);
  private basketService = inject(LocalStorageService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected auth = inject(AuthService);
  protected theme = inject(ThemeService);

  readonly tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '▦' },
    { id: 'details', label: 'Personal Info', icon: '☺' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙' },
  ];
  readonly languages = LANGUAGE_OPTIONS;
  readonly themeModes = [
    { id: ThemeMode.Light, label: '☀ Light' },
    { id: ThemeMode.Dark, label: '☾ Dark' },
    { id: ThemeMode.System, label: '◐ System' },
  ];
  readonly dateFormat = DateFormat.MediumDate;
  readonly numberFormat = NumberFormat;

  activeTab = signal<Tab>('overview');
  profile = signal<IUserProfile | null>(null);
  loadError = signal(false);
  savingDetails = signal(false);
  savingPassword = signal(false);
  passwordError = signal<string | null>(null);
  showPasswords = signal(false);

  readonly basket = this.basketService.getBasketSignal();
  readonly basketCount = this.basketService.basketCount;
  readonly basketTotal = computed(() =>
    this.basket().reduce((acc, item) => acc + item.currentPrice * (item.quantity ?? 1), 0),
  );
  readonly basketSavings = computed(() =>
    this.basket().reduce(
      (acc, item) =>
        acc + Math.max(0, item.originalPrice - item.currentPrice) * (item.quantity ?? 1),
      0,
    ),
  );
  readonly basketPreview = computed(() => this.basket().slice(0, 3));

  readonly initials = computed(() => {
    const name = this.auth.user()?.name ?? '';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts.at(-1)![0] : '')).toUpperCase() || '?';
  });

  readonly memberDays = computed(() => {
    const created = this.profile()?.createdAt;
    if (!created) return null;
    return Math.max(1, Math.ceil((Date.now() - new Date(created).getTime()) / DAY_MS));
  });

  /** Fields that make the account complete; drives the progress bar. */
  readonly completion = computed(() => {
    const p = this.profile();
    if (!p) return 0;
    const fields = [p.name, p.email, p.phone, p.address, p.city, p.country];
    return Math.round((fields.filter((f) => !!f?.trim()).length / fields.length) * 100);
  });

  detailsForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    phone: ['', [Validators.maxLength(30), Validators.pattern(/^[+\d\s()-]*$/)]],
    address: ['', [Validators.maxLength(200)]],
    city: ['', [Validators.maxLength(100)]],
    country: ['', [Validators.maxLength(100)]],
  });

  passwordForm = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  constructor() {
    // The session lives in localStorage, so the account can only be checked in the browser.
    if (!this.isBrowser) return;
    if (!this.auth.user()) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }
    this.loadProfile();

    // Signed out from another place (e.g. the header): leave the page.
    effect(() => {
      if (!this.auth.user()) this.router.navigate(['/login']);
    });
  }

  loadProfile() {
    this.loadError.set(false);
    this.auth.getProfile().subscribe({
      next: (p) => this.applyProfile(p),
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.toast.error('Your session has expired. Please sign in again.');
          this.auth.logout();
          return;
        }
        this.loadError.set(true);
      },
    });
  }

  selectTab(tab: Tab) {
    this.activeTab.set(tab);
  }

  fieldInvalid(name: keyof typeof this.detailsForm.controls): boolean {
    const c = this.detailsForm.controls[name];
    return c.invalid && c.touched;
  }

  resetDetails() {
    const p = this.profile();
    if (p) this.applyProfile(p);
  }

  saveDetails() {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched();
      return;
    }
    const v = this.detailsForm.getRawValue();
    const blankToNull = (s: string) => s.trim() || null;
    this.savingDetails.set(true);
    this.auth
      .updateProfile({
        name: v.name.trim(),
        phone: blankToNull(v.phone),
        address: blankToNull(v.address),
        city: blankToNull(v.city),
        country: blankToNull(v.country),
      })
      .subscribe({
        next: (p) => {
          this.savingDetails.set(false);
          this.applyProfile(p);
          this.toast.success('Your profile has been updated');
        },
        error: (err: HttpErrorResponse) => {
          this.savingDetails.set(false);
          this.toast.error(this.errorMessage(err));
        },
      });
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.savingPassword.set(true);
    this.passwordError.set(null);
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.passwordForm.reset();
        this.toast.success('Your password has been changed');
      },
      error: (err: HttpErrorResponse) => {
        this.savingPassword.set(false);
        this.passwordError.set(this.errorMessage(err));
      },
    });
  }

  passwordInvalid(name: keyof typeof this.passwordForm.controls): boolean {
    const c = this.passwordForm.controls[name];
    return c.invalid && c.touched;
  }

  setLanguage(code: LanguageCode) {
    this.languageService.setLanguage(code);
  }

  isLanguage(code: LanguageCode): boolean {
    return this.languageService.language() === code;
  }

  setTheme(mode: ThemeMode) {
    this.theme.setMode(mode);
  }

  async logout() {
    const ok = await this.toast.confirm(
      'You will need to sign in again to see your account.',
      'Sign out?',
      'Sign Out',
    );
    if (!ok) return;
    this.auth.logout();
    this.toast.show('You have been signed out');
  }

  private applyProfile(p: IUserProfile) {
    this.profile.set(p);
    this.detailsForm.reset({
      name: p.name,
      phone: p.phone ?? '',
      address: p.address ?? '',
      city: p.city ?? '',
      country: p.country ?? '',
    });
  }

  private errorMessage(err: HttpErrorResponse): string {
    return err.status === 0
      ? 'Cannot reach the server. Please try again later.'
      : (err.error?.error ?? 'Something went wrong');
  }
}
