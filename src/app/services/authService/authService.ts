// src/app/services/authService/authService.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, tap } from 'rxjs';
import { API_BASE_URL } from '../api';

export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface IUserProfile extends IUser {
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  createdAt: string;
}

export type ProfileUpdate = Pick<IUserProfile, 'name' | 'phone' | 'address' | 'city' | 'country'>;

interface IAuthResponse {
  token: string;
  user: IUser;
}

const STORAGE_KEY = 'heckto-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_BASE_URL);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly session = signal<IAuthResponse | null>(this.readSession());
  readonly user = computed(() => this.session()?.user ?? null);
  readonly isLoggedIn = computed(() => this.session() !== null);

  get token(): string | null {
    return this.session()?.token ?? null;
  }

  login(email: string, password: string): Observable<IAuthResponse> {
    return this.http
      .post<IAuthResponse>(`${this.apiUrl}/api/auth/login`, { email, password })
      .pipe(tap((res) => this.saveSession(res)));
  }

  register(name: string, email: string, password: string): Observable<IAuthResponse> {
    return this.http
      .post<IAuthResponse>(`${this.apiUrl}/api/auth/register`, { name, email, password })
      .pipe(tap((res) => this.saveSession(res)));
  }

  getProfile(): Observable<IUserProfile> {
    return this.http.get<IUserProfile>(`${this.apiUrl}/api/auth/me`);
  }

  updateProfile(changes: ProfileUpdate): Observable<IUserProfile> {
    return this.http
      .patch<IAuthResponse & { profile: IUserProfile }>(`${this.apiUrl}/api/auth/me`, changes)
      .pipe(
        tap(({ token, user }) => this.saveSession({ token, user })),
        map(({ profile }) => profile),
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/api/auth/password`, { currentPassword, newPassword });
  }

  logout() {
    this.session.set(null);
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  private saveSession(res: IAuthResponse) {
    this.session.set(res);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
    } catch {
      // ignore
    }
  }

  private readSession(): IAuthResponse | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as IAuthResponse) : null;
    } catch {
      return null;
    }
  }
}
