// src/app/services/chatService/chatService.ts
import { Injectable, inject, signal } from '@angular/core';
import { API_BASE_URL } from '../api';
import { LanguageService } from '../languageService/languageService';
import { ChatErrorCode } from '../../shared/chatWidget/chatI18n';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  /** Set on error bubbles; the widget shows the translated text for this code. */
  errorCode?: ChatErrorCode;
}

/** Talks to POST /api/chat, which streams the reply as Server-Sent Events. */
@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = inject(API_BASE_URL);
  private languageService = inject(LanguageService);
  private abort: AbortController | null = null;

  /** Conversation turns. The greeting is rendered by the widget, not stored here. */
  readonly messages = signal<IChatMessage[]>([]);
  readonly isStreaming = signal(false);

  async send(text: string) {
    const content = text.trim();
    if (!content || this.isStreaming()) return;

    // History sent to the API: real turns only (no error bubbles).
    const history = [...this.messages(), { role: 'user' as const, content }]
      .filter((m) => !m.errorCode)
      .map(({ role, content }) => ({ role, content }));

    this.messages.update((list) => [
      ...list,
      { role: 'user', content },
      { role: 'assistant', content: '' },
    ]);
    this.isStreaming.set(true);
    this.abort = new AbortController();

    try {
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, language: this.languageService.language() }),
        signal: this.abort.signal,
      });

      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        const code: ChatErrorCode =
          body?.code ?? (response.status === 429 ? 'rate_limited' : 'unavailable');
        this.setError(code);
        return;
      }

      await this.readEvents(response.body);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') this.setError('unavailable');
    } finally {
      this.isStreaming.set(false);
      this.abort = null;
      // Drop an empty assistant bubble (e.g. aborted before any text arrived)
      this.messages.update((list) => {
        const last = list[list.length - 1];
        return last?.role === 'assistant' && !last.content && !last.errorCode
          ? list.slice(0, -1)
          : list;
      });
    }
  }

  stop() {
    this.abort?.abort();
  }

  reset() {
    this.stop();
    this.messages.set([]);
  }

  private async readEvents(body: ReadableStream<Uint8Array>) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let sep: number;
      while ((sep = buffer.indexOf('\n\n')) !== -1) {
        const raw = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        const data = raw
          .split('\n')
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trim())
          .join('');
        if (!data) continue;
        const event = JSON.parse(data) as { type: string; text?: string; code?: ChatErrorCode };
        if (event.type === 'delta' && event.text) this.appendToLastAssistant(event.text);
        if (event.type === 'error') this.setError(event.code ?? 'generic');
      }
    }
  }

  private appendToLastAssistant(text: string) {
    this.messages.update((list) => {
      const copy = [...list];
      const last = copy[copy.length - 1];
      copy[copy.length - 1] = { ...last, content: last.content + text };
      return copy;
    });
  }

  private setError(errorCode: ChatErrorCode) {
    this.messages.update((list) => {
      const copy = [...list];
      const last = copy[copy.length - 1];
      const bubble: IChatMessage = { role: 'assistant', content: '', errorCode };
      if (last?.role === 'assistant' && !last.content) copy[copy.length - 1] = bubble;
      else copy.push(bubble);
      return copy;
    });
  }
}
