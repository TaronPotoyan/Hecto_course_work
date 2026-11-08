CREATE TABLE IF NOT EXISTS products (
  id              INTEGER PRIMARY KEY,
  name            TEXT NOT NULL,
  title           TEXT,
  owner           TEXT,
  published_at    DATE,
  current_price   NUMERIC(10, 2) NOT NULL CHECK (current_price >= 0),
  original_price  NUMERIC(10, 2) NOT NULL CHECK (original_price >= 0),
  rating          INTEGER NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  description     TEXT NOT NULL DEFAULT '',
  image_url       TEXT NOT NULL,
  type            TEXT NOT NULL,
  brand           TEXT,
  discount_offer  INTEGER CHECK (discount_offer BETWEEN 0 AND 100),
  category        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_type_idx ON products (type);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

CREATE TABLE IF NOT EXISTS promotions (
  id           INTEGER PRIMARY KEY,
  product_id   INTEGER NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  small_title  TEXT NOT NULL,
  title        TEXT NOT NULL,
  paragraph    TEXT NOT NULL,
  image_url    TEXT NOT NULL,
  type         TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS top_categories (
  id              INTEGER PRIMARY KEY,
  name            TEXT NOT NULL,
  image_url       TEXT NOT NULL,
  type            TEXT NOT NULL,
  current_price   NUMERIC(10, 2) NOT NULL,
  original_price  NUMERIC(10, 2) NOT NULL,
  rating          INTEGER NOT NULL DEFAULT 0,
  description     TEXT NOT NULL DEFAULT '',
  sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  password_hash  TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id          SERIAL PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
