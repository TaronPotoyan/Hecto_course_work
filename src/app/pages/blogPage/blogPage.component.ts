// src/app/pages/blogPage/blogPage.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { LanguageService } from '../../services/languageService/languageService';
import { SubscribeService } from '../../services/subscribeService/subscribeService';
import { PageBannerComponent } from '../../shared/pageBanner/pageBanner.component';
import { DateFormat } from '../../models/enum';
import { BLOG_POSTS, IBlogPost } from './blogPosts';

@Component({
  selector: 'app-blog-page',
  imports: [TranslatePipe, DatePipe, FormsModule, RouterLink, PageBannerComponent],
  templateUrl: './blogPage.component.html',
  styleUrl: './blogPage.component.scss',
})
export class BlogPageComponent {
  private languageService = inject(LanguageService);
  private subscribeService = inject(SubscribeService);

  readonly dateFormat = DateFormat.MediumDate;
  readonly posts = BLOG_POSTS;
  readonly recentPosts = BLOG_POSTS.slice(0, 3);
  readonly tags = [...new Set(BLOG_POSTS.flatMap((p) => p.tags))];
  readonly categories = [...new Set(BLOG_POSTS.map((p) => p.category))].map((name) => ({
    name,
    count: BLOG_POSTS.filter((p) => p.category === name).length,
  }));

  search = signal('');
  activeCategory = signal<string | null>(null);
  activeTag = signal<string | null>(null);
  email = signal('');
  subscribing = signal(false);

  readonly isFiltering = computed(
    () => !!this.search().trim() || !!this.activeCategory() || !!this.activeTag(),
  );

  readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const cat = this.activeCategory();
    const tag = this.activeTag();
    return this.posts.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (tag && !p.tags.includes(tag)) return false;
      if (!q) return true;
      return this.searchableText(p).includes(q);
    });
  });

  /** With no filters the first post is shown large; the rest go in the grid. */
  readonly featured = computed(() => (this.isFiltering() ? null : this.posts[0]));
  readonly gridPosts = computed(() =>
    this.isFiltering() ? this.filtered() : this.posts.slice(1),
  );

  selectCategory(name: string | null) {
    this.activeCategory.update((cur) => (cur === name ? null : name));
  }

  selectTag(name: string) {
    this.activeTag.update((cur) => (cur === name ? null : name));
  }

  clearFilters() {
    this.search.set('');
    this.activeCategory.set(null);
    this.activeTag.set(null);
  }

  async subscribe() {
    this.subscribing.set(true);
    if (await this.subscribeService.subscribe(this.email())) this.email.set('');
    this.subscribing.set(false);
  }

  /** Matches both the English text and the current translation. */
  private searchableText(p: IBlogPost): string {
    const t = (s: string) => this.languageService.translate(s);
    return [p.title, t(p.title), p.excerpt, t(p.excerpt), p.category, t(p.category), p.author, ...p.tags]
      .join(' ')
      .toLowerCase();
  }
}
