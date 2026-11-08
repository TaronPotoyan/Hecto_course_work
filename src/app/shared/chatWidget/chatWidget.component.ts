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
import { ChatService, IChatMessage } from '../../services/chatService/chatService';
import {
  LANGUAGE_OPTIONS,
  LanguageCode,
  LanguageService,
} from '../../services/languageService/languageService';
import { CHAT_STRINGS } from './chatI18n';

interface ISegment {
  text: string;
  link?: string;
}

const PRODUCT_LINK = /(\/products\/\d+)/g;

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
  protected readonly t = computed(() => CHAT_STRINGS[this.languageService.language()]);
  protected readonly hasConversation = computed(() => this.chat.messages().length > 0);

  protected isOpen = signal(false);
  protected draft = signal('');

  private messageList = viewChild<ElementRef<HTMLElement>>('messageList');
  private input = viewChild<ElementRef<HTMLTextAreaElement>>('input');

  constructor() {
    // Keep the newest message in view while the reply streams in.
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
    const text = this.draft();
    if (!text.trim()) return;
    this.draft.set('');
    this.chat.send(text);
  }

  ask(question: string) {
    this.chat.send(question);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  isTyping(message: IChatMessage): boolean {
    return message.role === 'assistant' && !message.content && !message.errorCode;
  }

  /** Splits a reply into text and in-app product links (e.g. "/products/3"). */
  segments(content: string): ISegment[] {
    return content
      .split(PRODUCT_LINK)
      .filter(Boolean)
      .map((part) =>
        /^\/products\/\d+$/.test(part) ? { text: part, link: part } : { text: part },
      );
  }
}
