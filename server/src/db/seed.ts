// Seeds the catalog from the frontend's static data (../src/DB/indexDb.ts).
// Idempotent: re-running updates existing rows.
import { DISCOUNT_PRODUCTS, PRODUCTS, TOP_CATEGORIES } from '../../../src/DB/indexDb.js';
import { pool } from './pool.js';

const toDate = (d?: Date) => (d ? d.toISOString().slice(0, 10) : null);

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const p of PRODUCTS) {
      await client.query(
        `INSERT INTO products (id, name, title, owner, published_at, current_price, original_price,
           rating, description, image_url, type, brand, discount_offer, category)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name, title = EXCLUDED.title, owner = EXCLUDED.owner,
           published_at = EXCLUDED.published_at, current_price = EXCLUDED.current_price,
           original_price = EXCLUDED.original_price, rating = EXCLUDED.rating,
           description = EXCLUDED.description, image_url = EXCLUDED.image_url, type = EXCLUDED.type,
           brand = EXCLUDED.brand, discount_offer = EXCLUDED.discount_offer, category = EXCLUDED.category`,
        [
          p.id, p.name, p.title ?? null, p.owner ?? null, toDate(p.date), p.currentPrice,
          p.originalPrice, p.rating, p.description, p.url.replace(/^\//, ''), p.type,
          p.brand ?? null, p.discountOffer ?? null, p.category ?? null,
        ],
      );
    }

    for (const [i, d] of DISCOUNT_PRODUCTS.entries()) {
      await client.query(
        `INSERT INTO promotions (id, product_id, small_title, title, paragraph, image_url, type, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE SET
           product_id = EXCLUDED.product_id, small_title = EXCLUDED.small_title, title = EXCLUDED.title,
           paragraph = EXCLUDED.paragraph, image_url = EXCLUDED.image_url, type = EXCLUDED.type,
           sort_order = EXCLUDED.sort_order`,
        [d._id, d.id, d.smallTitle, d.title, d.paragraph, d.imgUrl, d.type, i],
      );
    }

    for (const [i, c] of TOP_CATEGORIES.entries()) {
      await client.query(
        `INSERT INTO top_categories (id, name, image_url, type, current_price, original_price, rating, description, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name, image_url = EXCLUDED.image_url, type = EXCLUDED.type,
           current_price = EXCLUDED.current_price, original_price = EXCLUDED.original_price,
           rating = EXCLUDED.rating, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order`,
        [c.id, c.name, c.url, c.type, c.currentPrice, c.originalPrice, c.rating, c.description, i],
      );
    }

    await client.query('COMMIT');
    console.log(
      `Seeded ${PRODUCTS.length} products, ${DISCOUNT_PRODUCTS.length} promotions, ${TOP_CATEGORIES.length} top categories`,
    );
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
