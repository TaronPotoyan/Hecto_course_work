// src/app/shared/chatWidget/chatWidget.component.ts
import {
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChatService } from '../../services/chatService/chatService';
import {
  LANGUAGE_OPTIONS,
  LanguageCode,
  LanguageService,
} from '../../services/languageService/languageService';
import { CHAT_STRINGS, FaqId, IFaqItem, SUPPORT_CONTACT, matchFaq } from './chatI18n';

@Component({
  selector: 'app-chat-widget',
  imports: [FormsModule, RouterLink],
  templateUrl: './chatWidget.component.html',
  styleUrl: './chatWidget.component.scss',
})
export class ChatWidgetComponent {
  protected chat = inject(ChatService);
  protected languageService = inject(LanguageService);
  protected readonly languages = LANGUAGE_OPTIONS;
  protected readonly contact = SUPPORT_CONTACT;
  protected readonly t = computed(() => CHAT_STRINGS[this.languageService.language()]);
  protected readonly hasConversation = computed(() => this.chat.messages().length > 0);

  protected isOpen = signal(false);
  protected draft = signal('');

  private messageList = viewChild<ElementRef<HTMLElement>>('messageList');
  private input = viewChild<ElementRef<HTMLTextAreaElement>>('input');

  constructor() {
    // Keep the newest message in view.
    afterRenderEffect(() => {
      this.chat.messages();
      const el = this.messageList()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  toggle() {
    this.isOpen.update((open) => !open);
    if (this.isOpen()) setTimeout(() => this.input()?.nativeElement.focus());
  }

  setLanguage(code: LanguageCode) {
    this.languageService.setLanguage(code);
  }

  send() {
    const text = this.draft().trim();
    if (!text) return;
    this.draft.set('');
    this.chat.askText(text, matchFaq(this.t().faq, text)?.id);
  }

  ask(faqId: FaqId) {
    this.chat.askFaq(faqId);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  faq(id: FaqId | undefined): IFaqItem | undefined {
    return id ? this.t().faq.find((item) => item.id === id) : undefined;
  }

  /** Contacts go with the "contact a human" answer and with any unanswered question. */
  showsContact(id: FaqId | undefined): boolean {
    return !id || id === 'contact';
  }
}
