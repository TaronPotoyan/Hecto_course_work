import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { query } from '../db/pool.js';
import { optionalString, requireEmail, requireString } from '../lib/http.js';

export const contactRouter = Router();

contactRouter.post(
  '/',
  rateLimit({
    windowMs: 10 * 60_000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many messages, please try again later.' },
  }),
  async (req, res) => {
    const name = requireString(req.body, 'name', { max: 100 });
    const email = requireEmail(req.body);
    const subject = optionalString(req.body, 'subject', 200);
    const message = requireString(req.body, 'message', { min: 10, max: 5000 });

    await query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject, message],
    );
    res.status(201).json({ received: true });
  },
);
