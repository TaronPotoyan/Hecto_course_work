// src/app/services/languageService/languageService.ts
import { DOCUMENT, Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type LanguageCode = 'en' | 'hy' | 'ru';

export const LANGUAGE_OPTIONS: { code: LanguageCode; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hy', label: 'Հայերեն', short: 'ՀԱՅ' },
  { code: 'ru', label: 'Русский', short: 'РУ' },
];

const STORAGE_KEY = 'heckto-language';

/** The shopper's language, shared by the header picker and the support chat. */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly language = signal<LanguageCode>('en');

  constructor() {
    if (this.isBrowser) this.language.set(this.initialLanguage());
    effect(() => this.document.documentElement.setAttribute('lang', this.language()));
  }

  setLanguage(code: LanguageCode) {
    this.language.set(code);
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore unavailable storage
    }
  }

  labelFor(code: LanguageCode): string {
    return LANGUAGE_OPTIONS.find((o) => o.code === code)?.label ?? code;
  }

  private initialLanguage(): LanguageCode {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (this.isSupported(stored)) return stored;
    } catch {
      // ignore
    }
    const browser = navigator.language?.slice(0, 2).toLowerCase();
    return this.isSupported(browser) ? browser : 'en';
  }

  private isSupported(code: string | null | undefined): code is LanguageCode {
    return LANGUAGE_OPTIONS.some((o) => o.code === code);
  }
}
