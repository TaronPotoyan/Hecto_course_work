import { Router } from 'express';
import { query } from '../db/pool.js';
import { type AuthUser, hashPassword, requireAuth, signToken, verifyPassword } from '../lib/auth.js';
import { HttpError, optionalString, requireEmail, requireString } from '../lib/http.js';

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

interface ProfileRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  created_at: string;
}

const PROFILE_COLUMNS = 'id, name, email, phone, address, city, country, created_at';

function toProfile(row: ProfileRow) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    country: row.country,
    createdAt: row.created_at,
  };
}

function currentUserId(res: { locals: Record<string, unknown> }): number {
  return (res.locals['user'] as AuthUser).id;
}

authRouter.get('/me', requireAuth, async (_req, res) => {
  const [row] = await query<ProfileRow>(`SELECT ${PROFILE_COLUMNS} FROM users WHERE id = $1`, [
    currentUserId(res),
  ]);
  if (!row) throw new HttpError(404, 'Account not found');
  res.json(toProfile(row));
});

authRouter.patch('/me', requireAuth, async (req, res) => {
  const name = requireString(req.body, 'name', { max: 100 });
  const phone = optionalString(req.body, 'phone', 30);
  const address = optionalString(req.body, 'address', 200);
  const city = optionalString(req.body, 'city', 100);
  const country = optionalString(req.body, 'country', 100);

  const [row] = await query<ProfileRow>(
    `UPDATE users SET name = $1, phone = $2, address = $3, city = $4, country = $5
     WHERE id = $6 RETURNING ${PROFILE_COLUMNS}`,
    [name, phone, address, city, country, currentUserId(res)],
  );
  if (!row) throw new HttpError(404, 'Account not found');
  const user: AuthUser = { id: row.id, name: row.name, email: row.email };
  // The token carries the name, so issue a fresh one.
  res.json({ token: signToken(user), user, profile: toProfile(row) });
});

authRouter.post('/password', requireAuth, async (req, res) => {
  const currentPassword = requireString(req.body, 'currentPassword');
  const newPassword = requireString(req.body, 'newPassword', { min: 6, max: 200 });

  const id = currentUserId(res);
  const [row] = await query<{ password_hash: string }>(
    'SELECT password_hash FROM users WHERE id = $1',
    [id],
  );
  if (!row || !(await verifyPassword(currentPassword, row.password_hash))) {
    throw new HttpError(400, 'Current password is incorrect');
  }
  await query('UPDATE users SET password_hash = $1 WHERE id = $2', [
    await hashPassword(newPassword),
    id,
  ]);
  res.json({ updated: true });
});
