// src/app/shared/chatWidget/chatWidget.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ChatWidgetComponent } from './chatWidget.component';
import { LanguageService } from '../../services/languageService/languageService';
import { CHAT_STRINGS, SUPPORT_CONTACT } from './chatI18n';

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
    expect(suggestions).toEqual(CHAT_STRINGS.en.faq.map((f) => f.question));
  });

  it('switches the chat to Armenian and Russian', async () => {
    await open();
    const buttons = [...el.querySelectorAll<HTMLButtonElement>('.lang-switch button')];
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(['EN', 'ՀԱՅ', 'РУ']);

    buttons[1].click();
    fixture.detectChanges();
    expect(el.querySelector('.chat-panel__header h2')?.textContent).toBe(CHAT_STRINGS.hy.title);
    expect(el.querySelector('.suggestion')?.textContent?.trim()).toBe(
      CHAT_STRINGS.hy.faq[0].question,
    );

    buttons[2].click();
    fixture.detectChanges();
    expect(el.querySelector('.chat-panel__header h2')?.textContent).toBe(CHAT_STRINGS.ru.title);
    expect(TestBed.inject(LanguageService).language()).toBe('ru');
  });

  it('answers a popular question from the FAQ', async () => {
    await open();
    el.querySelectorAll<HTMLButtonElement>('.suggestion')[0].click();
    fixture.detectChanges();
    const bubbles = [...el.querySelectorAll('.bubble')].map((b) => b.textContent ?? '');
    expect(bubbles[1]).toContain(CHAT_STRINGS.en.faq[0].question);
    expect(bubbles[2]).toContain(CHAT_STRINGS.en.faq[0].answer);
  });

  const type = (text: string) => {
    const input = el.querySelector('textarea') as HTMLTextAreaElement;
    input.value = text;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    (el.querySelector('.send-btn') as HTMLButtonElement).click();
    fixture.detectChanges();
  };

  it('matches a typed question to the FAQ', async () => {
    await open();
    type('what is the delivery price?');
    const last = [...el.querySelectorAll('.bubble')].pop()?.textContent ?? '';
    expect(last).toContain(CHAT_STRINGS.en.faq[0].answer);
  });

  it('gives support contacts for an unknown question', async () => {
    await open();
    type('Do you sell bicycles?');
    const last = [...el.querySelectorAll('.bubble')].pop()?.textContent ?? '';
    expect(last).toContain(CHAT_STRINGS.en.noAnswer);
    expect(last).toContain(SUPPORT_CONTACT.email);
    expect(last).toContain(SUPPORT_CONTACT.phone);
  });

  it('every language has the same set of strings', () => {
    const shape = (o: object) => Object.keys(o).sort();
    for (const lang of ['hy', 'ru'] as const) {
      expect(shape(CHAT_STRINGS[lang])).toEqual(shape(CHAT_STRINGS.en));
      expect(CHAT_STRINGS[lang].faq.map((f) => f.id)).toEqual(CHAT_STRINGS.en.faq.map((f) => f.id));
    }
  });
});
