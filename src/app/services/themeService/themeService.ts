// src/app/services/themeService/themeService.ts
import { DOCUMENT, Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeMode } from '../../models/enum';

const STORAGE_KEY = 'heckto-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly systemPrefersDark = signal(false);

  /** What the user picked: light, dark or follow the OS. */
  readonly mode = signal<ThemeMode>(ThemeMode.System);

  /** The theme actually applied to the page. */
  readonly resolved = computed<ThemeMode.Light | ThemeMode.Dark>(() => {
    const mode = this.mode();
    if (mode === ThemeMode.System) {
      return this.systemPrefersDark() ? ThemeMode.Dark : ThemeMode.Light;
    }
    return mode;
  });

  constructor() {
    if (this.isBrowser) {
      this.mode.set(this.readStoredMode());

      const media = window.matchMedia?.('(prefers-color-scheme: dark)');
      if (media) {
        this.systemPrefersDark.set(media.matches);
        media.addEventListener('change', (e) => this.systemPrefersDark.set(e.matches));
      }
    }

    effect(() => {
      const theme = this.resolved();
      this.document.documentElement.setAttribute('data-theme', theme);
    });
  }

  setMode(mode: ThemeMode) {
    this.mode.set(mode);
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // storage can be unavailable (private mode); the choice still applies for this session
    }
  }

  private readStoredMode(): ThemeMode {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (Object.values(ThemeMode) as string[]).includes(stored)) {
        return stored as ThemeMode;
      }
    } catch {
      // ignore
    }
    return ThemeMode.System;
  }
}
