// src/app/shared/pageBanner/pageBanner.component.ts
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../i18n/translate.pipe';

export interface ICrumb {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-page-banner',
  imports: [RouterLink, TranslatePipe],
  template: `
    <section class="page-banner">
      <div class="container">
        <h1 class="page-banner__title">{{ title() | t }}</h1>
        <nav class="page-banner__crumbs" [attr.aria-label]="'Breadcrumb' | t">
          <a routerLink="/">{{ 'Home' | t }}</a>
          @for (crumb of crumbs(); track crumb.label) {
            <span class="sep" aria-hidden="true">/</span>
            @if (crumb.link) {
              <a [routerLink]="crumb.link">{{ crumb.label | t }}</a>
            } @else {
              <span class="current" aria-current="page">{{ crumb.label | t }}</span>
            }
          }
        </nav>
      </div>
    </section>
  `,
  styles: `
    @use '../../styles/variables' as *;
    .page-banner {
      background: $hero-section;
      padding: clamp(40px, 7vw, 80px) 0;
    }
    .page-banner__title {
      font-size: clamp(1.9rem, 4.5vw, 2.6rem);
      font-weight: 700;
      color: $text-strong;
      margin-bottom: 10px;
      overflow-wrap: anywhere;
    }
    .page-banner__crumbs {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 15px;
      color: $grey-4;
      a {
        color: $grey-4;
        text-decoration: none;
        cursor: pointer;
        &:hover {
          color: $primary;
        }
      }
      .sep {
        color: $grey-3;
      }
      .current {
        color: $primary;
      }
    }
  `,
})
export class PageBannerComponent {
  readonly title = input.required<string>();
  readonly crumbs = input<ICrumb[]>([]);
}
