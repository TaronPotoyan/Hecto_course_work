// src/app/pages/contactPage/contactPage.component.ts
import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { API_BASE_URL } from '../../services/api';
import { AuthService } from '../../services/authService/authService';
import { ToastService } from '../../services/toastService/toastService';
import { LanguageService } from '../../services/languageService/languageService';
import { PageBannerComponent } from '../../shared/pageBanner/pageBanner.component';

type Field = 'name' | 'email' | 'subject' | 'message';

const MAP_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=-0.1600%2C51.5385%2C-0.1460%2C51.5445&layer=mapnik&marker=51.5415%2C-0.1530';

@Component({
  selector: 'app-contact-page',
  imports: [TranslatePipe, ReactiveFormsModule, PageBannerComponent],
  templateUrl: './contactPage.component.html',
  styleUrl: './contactPage.component.scss',
})
export class ContactPageComponent {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private apiUrl = inject(API_BASE_URL);
  private toast = inject(ToastService);
  private languageService = inject(LanguageService);
  private auth = inject(AuthService);

  readonly mapUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(MAP_URL);

  readonly contactWays = [
    { icon: '✉', color: 'info', title: 'Email us', lines: ['mhhasanul@gmail.com', 'support@heckto.shop'], href: 'mailto:mhhasanul@gmail.com' },
    { icon: '☎', color: 'primary', title: 'Call us', lines: ['(12345) 67890', 'Mon–Fri, 9:00–18:00'], href: 'tel:1234567890' },
    { icon: '⌂', color: 'secondary', title: 'Visit us', lines: ['17 Princess Road, London', 'Greater London NW1 8JR, UK'], href: null },
    { icon: '🚚', color: 'success', title: 'Free standard shipment', lines: ['On orders over $100', 'Delivery in 3–5 days'], href: null },
  ];

  readonly faqs = [
    {
      q: 'How long does delivery take?',
      a: 'Standard delivery takes 3–5 business days. Express delivery arrives in 1–2 business days.',
    },
    {
      q: 'Can I return a product?',
      a: 'Yes. You can return any unused product within 30 days of delivery for a full refund.',
    },
    {
      q: 'Which payment methods do you accept?',
      a: 'We accept all major credit and debit cards. Payments are processed securely.',
    },
    {
      q: 'How can I track my order?',
      a: 'Once your order ships we send a tracking link to your email address.',
    },
  ];

  readonly maxMessage = 5000;
  sending = signal(false);
  sent = signal(false);
  serverError = signal<string | null>(null);

  form = this.fb.group({
    name: [this.auth.user()?.name ?? '', [Validators.required, Validators.maxLength(100)]],
    email: [
      this.auth.user()?.email ?? '',
      [Validators.required, Validators.email, Validators.maxLength(254)],
    ],
    subject: ['', [Validators.maxLength(200)]],
    message: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(this.maxMessage)],
    ],
  });

  showError(field: Field): boolean {
    const c = this.form.controls[field];
    return c.invalid && c.touched;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending.set(true);
    this.serverError.set(null);
    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}/api/contact`, this.form.getRawValue()));
      this.sent.set(true);
      this.toast.success(this.languageService.translate('Thanks! Your message has been sent.'));
      this.form.reset({ name: this.auth.user()?.name ?? '', email: this.auth.user()?.email ?? '' });
    } catch (err) {
      const e = err as HttpErrorResponse;
      this.serverError.set(
        e.status === 0
          ? 'Cannot reach the server. Please try again later.'
          : (e.error?.error ?? 'Something went wrong'),
      );
    } finally {
      this.sending.set(false);
    }
  }

  sendAnother() {
    this.sent.set(false);
  }
}
