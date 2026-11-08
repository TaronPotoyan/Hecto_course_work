// src/app/shared/chatWidget/chatI18n.ts
import { LanguageCode } from '../../services/languageService/languageService';

/** Human support contacts shown when a question isn't in the FAQ. */
export const SUPPORT_CONTACT = {
  email: 'mhhasanul@gmail.com',
  phone: '(12345)67890',
  phoneHref: 'tel:+1234567890',
} as const;

export type FaqId = 'shipping' | 'payment' | 'cart' | 'account' | 'sale' | 'contact';

export interface IFaqItem {
  id: FaqId;
  question: string;
  answer: string;
  /** Optional in-app page to open, e.g. the cart. */
  link?: { label: string; path: string };
  /** Lower-case words that match a typed question to this answer. */
  keywords: string[];
}

export interface IChatStrings {
  title: string;
  status: string;
  greeting: string;
  suggestionsTitle: string;
  faq: IFaqItem[];
  /** Reply for any question that isn't in the FAQ. */
  noAnswer: string;
  emailLabel: string;
  phoneLabel: string;
  moreQuestions: string;
  placeholder: string;
  newChat: string;
  close: string;
  open: string;
  send: string;
  language: string;
}

export const CHAT_STRINGS: Record<LanguageCode, IChatStrings> = {
  en: {
    title: 'Heckto Support',
    status: 'Frequently asked questions',
    greeting:
      'Hi! Pick one of the popular questions below. For anything else, type your question and we will share how to reach our team.',
    suggestionsTitle: 'Popular questions',
    faq: [
      {
        id: 'shipping',
        question: 'How much does shipping cost?',
        answer: 'Shipping is a flat $100 per order. It is added at checkout.',
        keywords: ['ship', 'deliver', 'shipping', 'delivery'],
      },
      {
        id: 'payment',
        question: 'How do I pay for my order?',
        answer:
          'Payment is by card. Open a product page and press "Add To Cart" — the card form opens there.',
        keywords: ['pay', 'card', 'payment', 'checkout'],
      },
      {
        id: 'cart',
        question: 'How can I change items in my cart?',
        answer:
          'On the cart page you can change quantities or clear the cart. Your cart is saved in this browser.',
        link: { label: 'Open cart', path: '/basket' },
        keywords: ['cart', 'basket', 'quantity', 'remove'],
      },
      {
        id: 'account',
        question: 'How do I create an account?',
        answer: 'You can sign in or create a new account on the login page.',
        link: { label: 'Go to login', path: '/login' },
        keywords: ['account', 'login', 'log in', 'sign', 'register', 'password'],
      },
      {
        id: 'sale',
        question: 'Which products are on sale?',
        answer:
          'Discounted products show the old price crossed out next to the new one. Browse the shop to see current deals.',
        link: { label: 'Browse products', path: '/products' },
        keywords: ['sale', 'discount', 'deal', 'offer', 'cheap'],
      },
      {
        id: 'contact',
        question: 'How can I contact a human agent?',
        answer: 'Our team is happy to help:',
        keywords: ['contact', 'human', 'agent', 'operator', 'email', 'phone', 'call'],
      },
    ],
    noAnswer:
      "Sorry, we don't have a ready answer for that. Please contact our support team and they will help you:",
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    moreQuestions: 'Other questions',
    placeholder: 'Type your question…',
    newChat: 'Start over',
    close: 'Close chat',
    open: 'Open support chat',
    send: 'Send',
    language: 'Language',
  },
  hy: {
    title: 'Heckto աջակցություն',
    status: 'Հաճախ տրվող հարցեր',
    greeting:
      'Բարև։ Ընտրեք հաճախ տրվող հարցերից մեկը։ Այլ հարցի դեպքում գրեք այն, և մենք կտրամադրենք մեր թիմի կոնտակտները։',
    suggestionsTitle: 'Հաճախ տրվող հարցեր',
    faq: [
      {
        id: 'shipping',
        question: 'Որքա՞ն արժե առաքումը։',
        answer: 'Առաքումը ֆիքսված $100 է յուրաքանչյուր պատվերի համար և ավելացվում է վճարման ժամանակ։',
        keywords: ['առաք', 'ship', 'deliver'],
      },
      {
        id: 'payment',
        question: 'Ինչպե՞ս վճարել պատվերի համար։',
        answer:
          'Վճարումը կատարվում է քարտով։ Բացեք ապրանքի էջը և սեղմեք «Ավելացնել զամբյուղ» — քարտի ձևը կբացվի այնտեղ։',
        keywords: ['վճար', 'քարտ', 'pay', 'card'],
      },
      {
        id: 'cart',
        question: 'Ինչպե՞ս փոխել զամբյուղի ապրանքները։',
        answer:
          'Զամբյուղի էջում կարող եք փոխել քանակը կամ դատարկել զամբյուղը։ Զամբյուղը պահվում է այս դիտարկիչում։',
        link: { label: 'Բացել զամբյուղը', path: '/basket' },
        keywords: ['զամբյուղ', 'քանակ', 'cart', 'basket'],
      },
      {
        id: 'account',
        question: 'Ինչպե՞ս ստեղծել հաշիվ։',
        answer: 'Մուտք գործել կամ նոր հաշիվ ստեղծել կարող եք մուտքի էջում։',
        link: { label: 'Անցնել մուտքի էջ', path: '/login' },
        keywords: ['հաշիվ', 'մուտք', 'գրանց', 'գաղտնաբառ', 'account', 'login'],
      },
      {
        id: 'sale',
        question: 'Ո՞ր ապրանքներն են զեղչված։',
        answer:
          'Զեղչված ապրանքների հին գինը ցուցադրվում է նոր գնի կողքին՝ ջնջված։ Դիտեք խանութը՝ ընթացիկ առաջարկները տեսնելու համար։',
        link: { label: 'Դիտել ապրանքները', path: '/products' },
        keywords: ['զեղչ', 'ակցիա', 'առաջարկ', 'sale', 'discount'],
      },
      {
        id: 'contact',
        question: 'Ինչպե՞ս կապվել աշխատակցի հետ։',
        answer: 'Մեր թիմը սիրով կօգնի ձեզ․',
        keywords: ['կապ', 'աշխատակց', 'օպերատոր', 'հեռախոս', 'փոստ', 'contact'],
      },
    ],
    noAnswer:
      'Ներողություն, այս հարցի պատրաստի պատասխան չունենք։ Խնդրում ենք կապվել մեր աջակցության թիմի հետ․',
    emailLabel: 'Էլ. փոստ',
    phoneLabel: 'Հեռախոս',
    moreQuestions: 'Այլ հարցեր',
    placeholder: 'Գրեք ձեր հարցը…',
    newChat: 'Սկսել նորից',
    close: 'Փակել զրույցը',
    open: 'Բացել աջակցության զրույցը',
    send: 'Ուղարկել',
    language: 'Լեզու',
  },
  ru: {
    title: 'Поддержка Heckto',
    status: 'Частые вопросы',
    greeting:
      'Здравствуйте! Выберите один из частых вопросов ниже. Если вашего вопроса нет, напишите его — и мы подскажем, как связаться с нашей командой.',
    suggestionsTitle: 'Частые вопросы',
    faq: [
      {
        id: 'shipping',
        question: 'Сколько стоит доставка?',
        answer: 'Доставка стоит фиксированно $100 за заказ и добавляется при оформлении.',
        keywords: ['достав', 'ship', 'deliver'],
      },
      {
        id: 'payment',
        question: 'Как оплатить заказ?',
        answer:
          'Оплата картой. Откройте страницу товара и нажмите «Добавить в корзину» — там откроется форма оплаты.',
        keywords: ['оплат', 'плат', 'карт', 'pay', 'card'],
      },
      {
        id: 'cart',
        question: 'Как изменить товары в корзине?',
        answer:
          'На странице корзины можно изменить количество или очистить корзину. Корзина сохраняется в этом браузере.',
        link: { label: 'Открыть корзину', path: '/basket' },
        keywords: ['корзин', 'количеств', 'cart', 'basket'],
      },
      {
        id: 'account',
        question: 'Как создать аккаунт?',
        answer: 'Войти или создать новый аккаунт можно на странице входа.',
        link: { label: 'Перейти ко входу', path: '/login' },
        keywords: ['аккаунт', 'вход', 'войти', 'регистр', 'пароль', 'account', 'login'],
      },
      {
        id: 'sale',
        question: 'Какие товары со скидкой?',
        answer:
          'У товаров со скидкой рядом с новой ценой показана зачёркнутая старая. Загляните в каталог, чтобы увидеть актуальные предложения.',
        link: { label: 'Смотреть товары', path: '/products' },
        keywords: ['скидк', 'акци', 'распродаж', 'sale', 'discount'],
      },
      {
        id: 'contact',
        question: 'Как связаться с оператором?',
        answer: 'Наша команда с радостью поможет:',
        keywords: ['связ', 'оператор', 'менеджер', 'телефон', 'почт', 'contact'],
      },
    ],
    noAnswer:
      'К сожалению, у нас нет готового ответа на этот вопрос. Пожалуйста, свяжитесь с нашей службой поддержки:',
    emailLabel: 'Почта',
    phoneLabel: 'Телефон',
    moreQuestions: 'Другие вопросы',
    placeholder: 'Напишите ваш вопрос…',
    newChat: 'Начать заново',
    close: 'Закрыть чат',
    open: 'Открыть чат поддержки',
    send: 'Отправить',
    language: 'Язык',
  },
};

/** Finds the FAQ entry whose keywords appear in a typed question. */
export function matchFaq(faq: IFaqItem[], text: string): IFaqItem | undefined {
  const q = text.toLowerCase();
  return faq.find((item) => item.keywords.some((k) => q.includes(k)));
}
