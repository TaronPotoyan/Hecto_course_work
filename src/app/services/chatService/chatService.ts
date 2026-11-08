// src/app/services/chatService/chatService.ts
import { Injectable, signal } from '@angular/core';
import type { FaqId } from '../../shared/chatWidget/chatI18n';

export type IChatMessage =
  /** A shopper question: either a picked FAQ (translated on render) or typed text. */
  | { role: 'user'; faqId?: FaqId; text?: string }
  /** A reply: the FAQ answer, or the "contact us" reply when faqId is undefined. */
  | { role: 'assistant'; faqId?: FaqId };

/** Support chat state. Answers come from the built-in FAQ; nothing is sent to a server. */
@Injectable({ providedIn: 'root' })
export class ChatService {
  readonly messages = signal<IChatMessage[]>([]);

  askFaq(faqId: FaqId) {
    this.messages.update((list) => [...list, { role: 'user', faqId }, { role: 'assistant', faqId }]);
  }

  /** A typed question, with the FAQ entry it matched (if any). */
  askText(text: string, faqId?: FaqId) {
    this.messages.update((list) => [...list, { role: 'user', text }, { role: 'assistant', faqId }]);
  }

  reset() {
    this.messages.set([]);
  }
}
