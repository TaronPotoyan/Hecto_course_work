import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireEmail } from '../lib/http.js';

export const subscribersRouter = Router();

subscribersRouter.post('/', async (req, res) => {
  const email = requireEmail(req.body);
  await query('INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email]);
  res.status(201).json({ subscribed: true });
});
