// src/app/pages/blogPage/blogPostPage.component.ts
import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { ToastService } from '../../services/toastService/toastService';
import { LanguageService } from '../../services/languageService/languageService';
import { PageBannerComponent } from '../../shared/pageBanner/pageBanner.component';
import { DateFormat } from '../../models/enum';
import { BLOG_POSTS, findPost } from './blogPosts';

@Component({
  selector: 'app-blog-post-page',
  imports: [TranslatePipe, DatePipe, RouterLink, PageBannerComponent],
  templateUrl: './blogPostPage.component.html',
  styleUrl: './blogPostPage.component.scss',
})
export class BlogPostPageComponent {
  private toast = inject(ToastService);
  private languageService = inject(LanguageService);

  readonly dateFormat = DateFormat.MediumDate;
  private readonly slug = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { initialValue: '' },
  );

  readonly post = computed(() => findPost(this.slug()));
  private readonly index = computed(() => BLOG_POSTS.findIndex((p) => p.slug === this.slug()));
  readonly previous = computed(() => BLOG_POSTS[this.index() + 1] ?? null);
  readonly next = computed(() => (this.index() > 0 ? BLOG_POSTS[this.index() - 1] : null));

  readonly related = computed(() => {
    const post = this.post();
    if (!post) return [];
    const others = BLOG_POSTS.filter((p) => p.slug !== post.slug);
    const sameTopic = others.filter(
      (p) => p.category === post.category || p.tags.some((t) => post.tags.includes(t)),
    );
    return [...sameTopic, ...others.filter((p) => !sameTopic.includes(p))].slice(0, 3);
  });

  async copyLink() {
    try {
      await navigator.clipboard.writeText(location.href);
      this.toast.success(this.languageService.translate('Link copied'));
    } catch {
      this.toast.error(this.languageService.translate('Could not copy the link'));
    }
  }
}
