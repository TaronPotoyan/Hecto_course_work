// src/app/services/navigatorService/navigatorService.ts
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigatorService {
  private navigator = inject(Router);

  private readonly urlSignal: Signal<string> = toSignal(
    this.navigator.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.navigator.url },
  );

  trackRouteChanges(): Signal<string> {
    return this.urlSignal;
  }

  currentUrl(): Signal<string> {
    return this.urlSignal;
  }

  handleNavigate(url: string, params?: string) {
    const path = url.toLowerCase().replace(/\s+/g, '-');
    this.navigator.navigate(params ? [`/${path}`, params] : [`/${path}`]);
  }
}
