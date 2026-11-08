import { Router } from 'express';
import { query } from '../db/pool.js';
import { type AuthUser, hashPassword, requireAuth, signToken, verifyPassword } from '../lib/auth.js';
import { HttpError, requireEmail, requireString } from '../lib/http.js';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const name = requireString(req.body, 'name', { max: 100 });
  const email = requireEmail(req.body);
  const password = requireString(req.body, 'password', { min: 6, max: 200 });

  const passwordHash = await hashPassword(password);
  const rows = await query<AuthUser>(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, name, email`,
    [name, email, passwordHash],
  );
  const user = rows[0];
  if (!user) throw new HttpError(409, 'An account with this email already exists');

  res.status(201).json({ token: signToken(user), user });
});

authRouter.post('/login', async (req, res) => {
  const email = requireEmail(req.body);
  const password = requireString(req.body, 'password');

  const [row] = await query<AuthUser & { password_hash: string }>(
    'SELECT id, name, email, password_hash FROM users WHERE email = $1',
    [email],
  );
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    throw new HttpError(401, 'Invalid email or password');
  }
  const user: AuthUser = { id: row.id, name: row.name, email: row.email };
  res.json({ token: signToken(user), user });
});

authRouter.get('/me', requireAuth, (_req, res) => {
  res.json(res.locals['user']);
});
