import { Router } from 'express';
import { query } from '../db/pool.js';
import { HttpError } from '../lib/http.js';

// Column aliases match the frontend's IProduct / IDiscountProduct interfaces.
export const PRODUCT_COLUMNS = `
  id, name, title, owner, published_at AS "date",
  current_price AS "currentPrice", original_price AS "originalPrice",
  rating, description, image_url AS "url", type, brand,
  discount_offer AS "discountOffer", category`;

export const catalogRouter = Router();

/** GET /api/products?q=&type=&category=&brand= */
catalogRouter.get('/products', async (req, res) => {
  const where: string[] = [];
  const params: unknown[] = [];
  const filters: Record<string, string> = { type: 'type', category: 'category', brand: 'brand' };

  for (const [param, column] of Object.entries(filters)) {
    const value = req.query[param];
    if (typeof value === 'string' && value) {
      params.push(value);
      where.push(`${column} = $${params.length}`);
    }
  }
  const q = req.query['q'];
  if (typeof q === 'string' && q.trim()) {
    params.push(`%${q.trim()}%`);
    where.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`);
  }

  const sql = `SELECT ${PRODUCT_COLUMNS} FROM products
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY id`;
  res.json(await query(sql, params));
});

catalogRouter.get('/products/:id', async (req, res) => {
  const id = Number(req.params['id']);
  if (!Number.isInteger(id)) throw new HttpError(400, 'Invalid product id');
  const [product] = await query(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = $1`, [id]);
  if (!product) throw new HttpError(404, 'Product not found');
  res.json(product);
});

catalogRouter.get('/promotions', async (_req, res) => {
  res.json(
    await query(`SELECT id AS "_id", product_id AS "id", small_title AS "smallTitle", title,
                        paragraph, image_url AS "imgUrl", type
                 FROM promotions ORDER BY sort_order, id`),
  );
});

catalogRouter.get('/top-categories', async (_req, res) => {
  res.json(
    await query(`SELECT id, name, image_url AS "url", type, current_price AS "currentPrice",
                        original_price AS "originalPrice", rating, description
                 FROM top_categories ORDER BY sort_order, id`),
  );
});
