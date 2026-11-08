// src/app/pages/loginComponent/login-component.ts
import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService/authService';
import { ToastService } from '../../services/toastService/toastService';

type Mode = 'login' | 'register';

@Component({
  selector: 'app-login',
  templateUrl: './login-component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./login-component.scss'],
})
export class LoginPageComponent {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private toast = inject(ToastService);
  protected auth = inject(AuthService);

  readonly socialProviders = ['Google', 'Facebook', 'GitHub'];

  mode = signal<Mode>('login');
  submitting = signal(false);
  serverError = signal<string | null>(null);

  form = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  setMode(mode: Mode) {
    this.mode.set(mode);
    this.serverError.set(null);
    const name = this.form.controls.name;
    name.setValidators(mode === 'register' ? [Validators.required] : []);
    name.updateValueAndValidity();
  }

  showError(control: 'name' | 'email' | 'password'): boolean {
    const c = this.form.controls[control];
    return c.invalid && c.touched;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, password } = this.form.getRawValue();
    const request =
      this.mode() === 'login'
        ? this.auth.login(email, password)
        : this.auth.register(name, email, password);

    this.submitting.set(true);
    this.serverError.set(null);
    request.subscribe({
      next: ({ user }) => {
        this.submitting.set(false);
        this.toast.success(`Welcome, ${user.name}!`);
        this.form.reset();
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.serverError.set(
          err.status === 0
            ? 'Cannot reach the server. Please try again later.'
            : (err.error?.error ?? 'Something went wrong'),
        );
      },
    });
  }

  socialLogin(provider: string) {
    this.toast.show(`Sign in with ${provider} is coming soon`);
  }

  logout() {
    this.auth.logout();
    this.toast.show('You have been signed out');
  }
}
