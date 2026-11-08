import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Pages depend on live API data, so render them per request instead of at build time.
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
