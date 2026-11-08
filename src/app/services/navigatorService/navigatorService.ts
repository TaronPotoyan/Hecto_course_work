// src/app/services/navigatorService/navigatorService.ts
// src/app/services/NavigatorService/navigatorService.ts
import { inject, Injectable, signal, Signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigatorService {
  private navigator = inject(Router);
  private urlSignal = signal<string>(this.navigator.url);

  trackRouteChanges(): Signal<string> {
    this.navigator.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.urlSignal.set(event.urlAfterRedirects);
      });

    return this.urlSignal.asReadonly();
  }

  currentUrl(): Signal<string> {
    return this.urlSignal.asReadonly();
  }

  handleNavigate(url: string, params?: string) {
    const path = url.toLowerCase().replace(/\s+/g, '-');
    console.log(path);
    this.navigator.navigate(params ? [`/${path}`, params] : [`/${path}`]);
  }
}
