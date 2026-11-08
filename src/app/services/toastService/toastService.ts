// src/app/services/toastService/toastService.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { SweetAlertIcon } from 'sweetalert2';
import { LanguageService } from '../languageService/languageService';

export type ToastKind = 'success' | 'error' | 'info';

/** Brand colors (see src/app/styles/_variables.scss). */
const PRIMARY = '#fb2e86';
const MUTED = '#9096b2';

/**
 * Non-blocking replacement for `alert()` / `confirm()`, backed by SweetAlert2.
 * The library is loaded lazily and only in the browser, so SSR stays safe.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly i18n = inject(LanguageService);
  private swal?: Promise<typeof import('sweetalert2').default>;

  private load() {
    this.swal ??= import('sweetalert2').then((m) => m.default);
    return this.swal;
  }

  show(message: string, kind: ToastKind = 'info', durationMs = 3000) {
    if (!this.isBrowser) return;
    void this.load().then((Swal) =>
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: kind as SweetAlertIcon,
        title: this.i18n.translate(message),
        showConfirmButton: false,
        showCloseButton: true,
        timer: durationMs,
        timerProgressBar: true,
        didOpen: (el) => {
          el.addEventListener('mouseenter', Swal.stopTimer);
          el.addEventListener('mouseleave', Swal.resumeTimer);
        },
      }),
    );
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error', 4500);
  }

  /** Styled confirmation dialog. Resolves `true` if the user confirmed. */
  async confirm(message: string, title = 'Are you sure?', confirmText = 'Yes'): Promise<boolean> {
    if (!this.isBrowser) return false;
    const Swal = await this.load();
    const result = await Swal.fire({
      title: this.i18n.translate(title),
      text: this.i18n.translate(message),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.i18n.translate(confirmText),
      cancelButtonText: this.i18n.translate('Cancel'),
      confirmButtonColor: PRIMARY,
      cancelButtonColor: MUTED,
      reverseButtons: true,
      focusCancel: true,
    });
    return result.isConfirmed;
  }
}
