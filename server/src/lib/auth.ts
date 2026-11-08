import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { HttpError } from './http.js';

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, keylen: number) => Promise<Buffer>;
const KEY_LEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEY_LEN);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, saltHex, hashHex] = stored.split('$');
  if (algo !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length);
  return timingSafeEqual(actual, expected);
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ email: user.email, name: user.name }, config.jwtSecret, {
    subject: String(user.id),
    expiresIn: '24h',
  });
}

/** Express middleware: requires `Authorization: Bearer <token>`, sets `res.locals.user`. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) throw new HttpError(401, 'Authentication required');
  try {
    const payload = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
    res.locals['user'] = {
      id: Number(payload.sub),
      email: payload['email'],
      name: payload['name'],
    } satisfies AuthUser;
    next();
  } catch {
    throw new HttpError(401, 'Invalid or expired token');
  }
}
