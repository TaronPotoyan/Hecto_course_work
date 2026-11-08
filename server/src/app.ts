import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { pool } from './db/pool.js';
import { errorHandler, notFound } from './lib/http.js';
import { authRouter } from './routes/auth.js';
import { catalogRouter } from './routes/catalog.js';
import { chatRouter } from './routes/chat.js';
import { contactRouter } from './routes/contact.js';
import { subscribersRouter } from './routes/subscribers.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 'loopback');
  app.disable('x-powered-by');
  app.use(cors({ origin: config.corsOrigins.includes('*') ? '*' : config.corsOrigins }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', async (_req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok', db: 'up' });
    } catch {
      res.status(503).json({ status: 'degraded', db: 'down' });
    }
  });

  app.use('/api', catalogRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/subscribers', subscribersRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/contact', contactRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
