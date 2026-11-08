// src/app/pages/blogPage/blogPosts.ts
// Static blog content. Titles, excerpts and categories are translated in
// i18n/translations.ts; article bodies are English.

export interface IBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string; // ISO date
  readMinutes: number;
  image: string;
  tags: string[];
  body: string[];
}

export const BLOG_POSTS: IBlogPost[] = [
  {
    slug: 'choose-the-right-laptop',
    title: 'How to Choose the Right Laptop This Year',
    excerpt:
      'Processor, memory, screen and battery life: what actually matters when you buy a new laptop, and where you can save money.',
    category: 'Tech',
    author: 'Mark Wilson',
    date: '2026-10-28',
    readMinutes: 6,
    image: 'MacBook.svg',
    tags: ['Laptops', 'Buying Guide'],
    body: [
      'Start with what you will do on the laptop every day. Writing, browsing and video calls run well on almost any modern machine, while photo editing, programming and gaming need more power.',
      'For most people 16 GB of memory and a fast SSD make a bigger difference than the newest processor. A 512 GB drive is a comfortable minimum if you keep photos and projects locally.',
      'Look closely at the screen. A bright panel with good color coverage is easier on the eyes, and a 14-inch size is the best balance between portability and comfort.',
      'Finally, check real battery tests rather than the number on the box, and make sure the laptop has the ports you need so you are not carrying a bag of adapters.',
    ],
  },
  {
    slug: 'next-gen-gaming-consoles',
    title: 'Next-Gen Gaming: Is a New Console Worth It?',
    excerpt:
      'Faster loading, better graphics and a growing game library. We compare what you get from upgrading your console today.',
    category: 'Gaming',
    author: 'Lilit Hakobyan',
    date: '2026-10-15',
    readMinutes: 5,
    image: 'playstation.svg',
    tags: ['Consoles', 'Games'],
    body: [
      'The biggest change in the latest consoles is storage. Games that used to take a minute to load now start in seconds, and that changes how often you actually play.',
      'Graphics improvements are real but depend on your TV. If you still use a 1080p screen, you will notice the speed long before you notice the extra detail.',
      'Check backward compatibility before you trade in your old console. Most of your existing library will carry over, often with better frame rates.',
      'If the games you love are already out on the new system, upgrading now is worth it. If not, waiting for a bundle or a seasonal sale is a smart move.',
    ],
  },
  {
    slug: 'smartwatch-buying-guide',
    title: 'Smartwatch Buying Guide: Features That Matter',
    excerpt:
      'Health tracking, battery, apps and style. A simple checklist to find the smartwatch that fits your daily routine.',
    category: 'Wearables',
    author: 'Sara Klein',
    date: '2026-09-30',
    readMinutes: 4,
    image: 'watch1.svg',
    tags: ['Smartwatch', 'Health'],
    body: [
      'First make sure the watch works with your phone. Some models only pair fully with one platform, and you lose notifications or apps on the other.',
      'Battery life ranges from one day to two weeks. If you want sleep tracking, choose a model that comfortably lasts at least two days.',
      'Heart rate, sleep and step tracking are standard now. Built-in GPS and blood-oxygen sensors are worth paying for if you run or train outdoors.',
      'Do not forget comfort: try the size on your wrist and pick a strap you can wear all day.',
    ],
  },
  {
    slug: 'noise-cancelling-headphones',
    title: 'Wireless Headphones: Noise Cancelling Explained',
    excerpt:
      'How active noise cancelling works, when you need it and how to compare headphones without getting lost in the specs.',
    category: 'Audio',
    author: 'Mark Wilson',
    date: '2026-09-12',
    readMinutes: 5,
    image: 'HeadPoint1.svg',
    tags: ['Headphones', 'Buying Guide'],
    body: [
      'Active noise cancelling uses small microphones to listen to the sound around you and plays an opposite wave that cancels it out. It works best on steady noise such as engines and air conditioning.',
      'Over-ear headphones usually block more noise than earbuds because they also seal the ear physically. Earbuds win on portability and workouts.',
      'Look for a transparency mode so you can hear announcements without taking them off, and for multipoint pairing if you switch between a laptop and a phone.',
      'Battery life of 20 hours or more and a quick-charge feature will cover almost any trip.',
    ],
  },
  {
    slug: 'gift-ideas-every-budget',
    title: 'Gift Ideas for Every Budget',
    excerpt:
      'From small surprises to big presents: our team picks gifts that people actually use, sorted by price.',
    category: 'Lifestyle',
    author: 'Lilit Hakobyan',
    date: '2026-08-27',
    readMinutes: 3,
    image: 'present-box.svg',
    tags: ['Gifts', 'Deals'],
    body: [
      'Under $50: a quality phone stand, a portable charger or a set of wireless earbuds are useful gifts that never feel random.',
      'Between $50 and $200: a smartwatch, a fragrance or a Bluetooth speaker are popular choices that suit almost anyone.',
      'Above $200: a new console, premium headphones or a lightweight laptop make a gift that will be used every day.',
      'Tip: add the item to your cart early and keep an eye on our discount section before the holidays.',
    ],
  },
  {
    slug: 'sneaker-care-101',
    title: 'Sneaker Care 101: Keep Your Shoes Like New',
    excerpt:
      'Simple cleaning and storage habits that keep your favourite pair looking fresh for years.',
    category: 'Lifestyle',
    author: 'Sara Klein',
    date: '2026-08-09',
    readMinutes: 4,
    image: 'shoes1.svg',
    tags: ['Shoes', 'Care'],
    body: [
      'Brush off dry dirt before it sets. A soft brush and a little warm water with mild soap handle most stains on canvas and leather.',
      'Never put sneakers in the dryer. Stuff them with paper and let them air-dry away from direct heat so the glue and shape stay intact.',
      'A water-repellent spray protects new shoes from rain and makes the next cleaning much easier.',
      'Rotate between pairs when you can. Giving shoes a day to rest lets the cushioning recover and doubles their life.',
    ],
  },
];

export function findPost(slug: string): IBlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
