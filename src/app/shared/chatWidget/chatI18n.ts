// src/app/shared/chatWidget/chatI18n.ts
import { LanguageCode } from '../../services/languageService/languageService';

export type ChatErrorCode =
  | 'not_configured'
  | 'busy'
  | 'unavailable'
  | 'refused'
  | 'rate_limited'
  | 'generic';

export interface IChatStrings {
  title: string;
  status: string;
  greeting: string;
  suggestionsTitle: string;
  suggestions: string[];
  placeholder: string;
  newChat: string;
  close: string;
  open: string;
  send: string;
  stop: string;
  typing: string;
  language: string;
  errors: Record<ChatErrorCode, string>;
}

export const CHAT_STRINGS: Record<LanguageCode, IChatStrings> = {
  en: {
    title: 'Heckto Support',
    status: 'AI assistant · usually instant',
    greeting:
      "Hi! I'm the Heckto assistant. Ask me about products, prices, shipping or your cart, or pick a question below.",
    suggestionsTitle: 'Popular questions',
    suggestions: [
      'How much does shipping cost?',
      'How do I pay for my order?',
      'How can I change items in my cart?',
      'How do I create an account?',
      'Which products are on sale?',
      'How can I contact a human agent?',
    ],
    placeholder: 'Ask about a product, shipping…',
    newChat: 'New conversation',
    close: 'Close chat',
    open: 'Open support chat',
    send: 'Send',
    stop: 'Stop',
    typing: 'Assistant is typing',
    language: 'Language',
    errors: {
      not_configured: 'The support assistant is not configured yet. Please contact us by email.',
      busy: 'The assistant is busy right now. Please try again in a moment.',
      unavailable: 'Could not reach the assistant. Please try again.',
      refused: "Sorry, I can't help with that. For anything else about the store, just ask!",
      rate_limited: 'Too many messages. Please wait a moment and try again.',
      generic: 'Something went wrong. Please try again.',
    },
  },
  hy: {
    title: 'Heckto աջակցություն',
    status: 'AI օգնական · պատասխանում է անմիջապես',
    greeting:
      'Բարև։ Ես Heckto-ի օգնականն եմ։ Հարցրեք ապրանքների, գների, առաքման կամ զամբյուղի մասին, կամ ընտրեք հարց ստորև։',
    suggestionsTitle: 'Հաճախ տրվող հարցեր',
    suggestions: [
      'Որքա՞ն արժե առաքումը։',
      'Ինչպե՞ս վճարել պատվերի համար։',
      'Ինչպե՞ս փոխել զամբյուղի ապրանքները։',
      'Ինչպե՞ս ստեղծել հաշիվ։',
      'Ո՞ր ապրանքներն են զեղչված։',
      'Ինչպե՞ս կապվել աշխատակցի հետ։',
    ],
    placeholder: 'Հարցրեք ապրանքի, առաքման մասին…',
    newChat: 'Նոր զրույց',
    close: 'Փակել զրույցը',
    open: 'Բացել աջակցության զրույցը',
    send: 'Ուղարկել',
    stop: 'Կանգնեցնել',
    typing: 'Օգնականը գրում է',
    language: 'Լեզու',
    errors: {
      not_configured: 'Աջակցության օգնականը դեռ կարգավորված չէ։ Խնդրում ենք կապվել մեզ էլ. փոստով։',
      busy: 'Օգնականը հիմա զբաղված է։ Խնդրում ենք փորձել մի փոքր ուշ։',
      unavailable: 'Չհաջողվեց կապվել օգնականի հետ։ Խնդրում ենք կրկին փորձել։',
      refused: 'Ներողություն, այս հարցում չեմ կարող օգնել։ Խանութի մասին այլ հարցեր տվեք։',
      rate_limited: 'Չափազանց շատ հաղորդագրություններ։ Խնդրում ենք մի փոքր սպասել։',
      generic: 'Ինչ-որ բան սխալ գնաց։ Խնդրում ենք կրկին փորձել։',
    },
  },
  ru: {
    title: 'Поддержка Heckto',
    status: 'AI-ассистент · отвечает мгновенно',
    greeting:
      'Здравствуйте! Я ассистент Heckto. Спрашивайте о товарах, ценах, доставке или корзине, либо выберите вопрос ниже.',
    suggestionsTitle: 'Частые вопросы',
    suggestions: [
      'Сколько стоит доставка?',
      'Как оплатить заказ?',
      'Как изменить товары в корзине?',
      'Как создать аккаунт?',
      'Какие товары со скидкой?',
      'Как связаться с оператором?',
    ],
    placeholder: 'Спросите о товаре, доставке…',
    newChat: 'Новый диалог',
    close: 'Закрыть чат',
    open: 'Открыть чат поддержки',
    send: 'Отправить',
    stop: 'Остановить',
    typing: 'Ассистент печатает',
    language: 'Язык',
    errors: {
      not_configured: 'Ассистент поддержки ещё не настроен. Пожалуйста, напишите нам на почту.',
      busy: 'Ассистент сейчас занят. Попробуйте чуть позже.',
      unavailable: 'Не удалось связаться с ассистентом. Попробуйте ещё раз.',
      refused: 'Извините, с этим я помочь не могу. Задавайте любые другие вопросы о магазине!',
      rate_limited: 'Слишком много сообщений. Подождите немного и попробуйте снова.',
      generic: 'Что-то пошло не так. Попробуйте ещё раз.',
    },
  },
};
