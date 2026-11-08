// src/app/services/subscribeService/subscribeService.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../api';
import { ToastService } from '../toastService/toastService';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable({ providedIn: 'root' })
export class SubscribeService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_BASE_URL);
  private toast = inject(ToastService);

  /** Returns true when the subscription succeeded. */
  async subscribe(email: string): Promise<boolean> {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      this.toast.error('Please enter a valid email address');
      return false;
    }
    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}/api/subscribers`, { email: value }));
      this.toast.success('Thanks for subscribing!');
      return true;
    } catch (err) {
      const message = (err as HttpErrorResponse).error?.error ?? 'Could not subscribe right now';
      this.toast.error(message);
      return false;
    }
  }
}
