// src/app/i18n/translate.pipe.ts
import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService, TranslateParams } from '../services/languageService/languageService';

/**
 * `{{ 'Shop Now' | t }}` / `{{ '{count} results' | t: { count: n } }}`
 * Impure so it re-renders when the language signal changes.
 */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private languageService = inject(LanguageService);

  transform(key: string | null | undefined, params?: TranslateParams): string {
    return this.languageService.translate(key ?? '', params);
  }
}
