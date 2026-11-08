// src/app/shared/chatWidget/chatWidget.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ChatWidgetComponent } from './chatWidget.component';
import { ChatService } from '../../services/chatService/chatService';
import { LanguageService } from '../../services/languageService/languageService';
import { CHAT_STRINGS } from './chatI18n';

describe('ChatWidgetComponent', () => {
  let fixture: ComponentFixture<ChatWidgetComponent>;
  let el: HTMLElement;

  const open = async () => {
    (el.querySelector('.chat-fab') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWidgetComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    TestBed.inject(LanguageService).setLanguage('en');
    fixture = TestBed.createComponent(ChatWidgetComponent);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('shows the greeting and generic suggested questions when opened', async () => {
    await open();
    expect(el.querySelector('.bubble')?.textContent).toContain(CHAT_STRINGS.en.greeting);
    const suggestions = [...el.querySelectorAll('.suggestion')].map((b) => b.textContent?.trim());
    expect(suggestions).toEqual(CHAT_STRINGS.en.suggestions);
  });

  it('switches the chat to Armenian and Russian', async () => {
    await open();
    const buttons = [...el.querySelectorAll<HTMLButtonElement>('.lang-switch button')];
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(['EN', 'ՀԱՅ', 'РУ']);

    buttons[1].click();
    fixture.detectChanges();
    expect(el.querySelector('.chat-panel__header h2')?.textContent).toBe(CHAT_STRINGS.hy.title);
    expect(el.querySelector('.suggestion')?.textContent?.trim()).toBe(
      CHAT_STRINGS.hy.suggestions[0],
    );

    buttons[2].click();
    fixture.detectChanges();
    expect(el.querySelector('.chat-panel__header h2')?.textContent).toBe(CHAT_STRINGS.ru.title);
    expect(TestBed.inject(LanguageService).language()).toBe('ru');
  });

  it('sends a suggested question with the selected language', async () => {
    const chat = TestBed.inject(ChatService);
    const send = vi.spyOn(chat, 'send').mockResolvedValue();
    await open();
    el.querySelectorAll<HTMLButtonElement>('.suggestion')[0].click();
    expect(send).toHaveBeenCalledWith(CHAT_STRINGS.en.suggestions[0]);
  });

  it('every language has the same set of strings', () => {
    const shape = (o: object) => Object.keys(o).sort();
    for (const lang of ['hy', 'ru'] as const) {
      expect(shape(CHAT_STRINGS[lang])).toEqual(shape(CHAT_STRINGS.en));
      expect(shape(CHAT_STRINGS[lang].errors)).toEqual(shape(CHAT_STRINGS.en.errors));
      expect(CHAT_STRINGS[lang].suggestions.length).toBe(CHAT_STRINGS.en.suggestions.length);
    }
  });
});
