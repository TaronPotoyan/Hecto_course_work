// src/app/models/enum.ts
// src/Models/enum.ts

export enum NumberFormat {
  Currency = '1.2-2',
  Percent = '1.0-0',
  Decimal = '1.2-4',
}

export enum DateFormat {
  FullDate = 'EEEE, MMMM d, y',
  ShortDate = 'MM/dd/yy',
  MediumDate = 'MMM d, y',
  YearMonth = 'MMMM y',
  TimeOnly = 'h:mm a',
  Technical = 'yyyy-MM-dd',
  NotAvailable = 'N/A',
}

export enum SocialMedia {
  INST = 'INST',
  TW = 'TW',
  PIN = 'PIN',
}

export enum Languages {
  English = 'en',
  Armenian = 'hy',
  Russian = 'ru',
}

export enum Currencies {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GPB',
}

export enum ProductAction {
  Zoom = 'Zoom',
  Basket = 'Basket',
  Like = 'Like',
}

export enum ProductActionIcons {
  ZoomIcon = 'Zoom-icon.svg',
  BasketIcon = 'Basket-icon.svg',
  LikeIcon = 'heart-icon.svg',
}

export enum ProductDescription {
  Home = 'Home',
  Tech = 'Tech',
  Trend = 'Trend',
}

export enum QuantityAction {
  DecreaseByOne = -1,
  IncreaseByOne = 1,
}

export enum BrandNames {
  Apple = 'Apple',
  Samsung = 'Samsung',
  Sony = 'Sony',
  Dell = 'Dell',
  HP = 'HP',
}

export enum FilterBy {
  ProductBrand = 'Product Brand',
  DiscountOffer = 'Discount offer',
  Rating = 'Rating',
  Categories = 'Categories',
  PriceFilter = 'Price Filter',
}

export enum FooterSectionTitle {
  Categories = 'Categories',
  CustomerCare = 'Customer Care',
  Pages = 'Pages',
}

export enum FooterSectionTitleLinks {
  CategoriesLink = 'Laptops & Computers, Cameras & Photography, Smart Phones & Tablets, Video Games & Consoles, Waterproof Headphones',
  CustomerCareLink = 'My Account, Discount, Returns, Orders History, Order Tracking',
  PagesLink = 'Blog, Browse the Shop, Category, Pre-Built Pages, Visual Composer Elements',
}

export enum MenuOptions {
  Login = 'Login',
  Wishings = 'Wishings',
  Basket = 'Basket',
}
export enum MenuOptionsImgs {
  LoginImg = 'white-user.svg',
  WishingsImg = 'white-heart.svg',
  BasketImg = 'white-basket.svg',
}

export enum RouteMenuEnum {
  Heckto = 'Heckto',
  Home = 'Home',
  Products = 'Products',
  Blog = 'Blog',
  Contact = 'Contact',
}

export enum AppRoutes {
  Home = '',
  HomeAlias = 'home',
  Products = 'products',
  ProductDetails = ':id',
  Login = 'login',
  Basket = 'basket',
  Heckto = 'heckto',
  Blog = 'blog',
  Contact = 'contact',
  NotFound = '**',
}

export enum DiscountExtensionText {
  MaterialExpose = 'Material expose like metals',
  ClearLines = 'Clear lines and geomatric figures',
  SimpleColors = 'Simple neutral colours.',
  $MaterialExpose = 'Material expose like metals',
}

export enum UniqueInfoCons {
  FrameMaterial = 'All frames constructed with hardwood solids and laminates',
  ReinforcedCorners = 'Reinforced with double wood dowels, glue, screw - nails corner',
  StructuralReinforcement = 'Arms, backs and seats are structurally reinforced',
}

export enum ProductDetailTab {
  Description = 'Description',
  AdditionalInfo = 'Additional Info',
  Reviews = 'Reviews',
  Video = 'Video',
}

export enum CartFormField {
  CardNumber = 'cardNumber',
  ExpDate = 'expDate',
  CVV = 'cvv',
  HolderName = 'holderName',
}

export enum DiscountNavItemType {
  HeadPhone = 'HeadPhone',
  LapTop = 'LapTop',
  Other = 'Other',
}

export enum ProductMoreDetails {
  TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ac quam dolor. Indignissim lectus sed nisl tempor, ac porttitor libero consectetur.',
}

export const DEFAULT_STAR_COUNT = 5;

export enum ViewMode {
  GridMode = 'grid-mode',
  ListMode = 'list-mode',
}

export enum ProductLayout {
  grid = 'grid',
  list = 'list',
}

export enum FutureProduct {
  Tech = 'Tech',
  Trend = 'Trend',
}

export enum SortBy {
  HighToLow = 'high-low',
  LowToHigh = 'low-high',
}

// Keys match SocialMedia so each icon maps to its own link.
export enum SocialMediaLinks {
  INST = 'https://www.instagram.com/',
  TW = 'https://x.com/',
  PIN = 'https://www.pinterest.com/',
}

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}
