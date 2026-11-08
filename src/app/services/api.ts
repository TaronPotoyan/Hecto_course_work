// src/app/services/api.ts
import { InjectionToken } from '@angular/core';

/**
 * Base URL prepended to every `/api/...` request.
 * - Browser: '' (same origin; proxied to the backend by `proxy.conf.json` in dev
 *   and by `src/server.ts` in production).
 * - Server (SSR): overridden in `app.config.server.ts` with the backend's absolute URL.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '',
});
