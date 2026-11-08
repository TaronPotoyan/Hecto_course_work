// src/app/shared/toast/toast.component.ts
import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toastService/toastService';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-stack" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast toast--' + toast.kind" role="status">
          <span>{{ toast.message }}</span>
          <button type="button" aria-label="Dismiss" (click)="toastService.dismiss(toast.id)">
            ×
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  protected toastService = inject(ToastService);
}
