import type { NextFunction, Request, Response } from 'express';

/** Error with an HTTP status that the error handler turns into a JSON response. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requireString(body: unknown, field: string, opts: { min?: number; max?: number } = {}) {
  const value = (body as Record<string, unknown> | undefined)?.[field];
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `"${field}" is required`);
  }
  const trimmed = value.trim();
  if (opts.min && trimmed.length < opts.min) {
    throw new HttpError(400, `"${field}" must be at least ${opts.min} characters`);
  }
  if (opts.max && trimmed.length > opts.max) {
    throw new HttpError(400, `"${field}" must be at most ${opts.max} characters`);
  }
  return trimmed;
}

/** Optional string field: missing/blank → null, otherwise trimmed and length-checked. */
export function optionalString(body: unknown, field: string, max: number): string | null {
  const value = (body as Record<string, unknown> | undefined)?.[field];
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') throw new HttpError(400, `"${field}" must be a string`);
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > max) {
    throw new HttpError(400, `"${field}" must be at most ${max} characters`);
  }
  return trimmed;
}

export function requireEmail(body: unknown, field = 'email') {
  const email = requireString(body, field, { max: 254 }).toLowerCase();
  if (!EMAIL_RE.test(email)) throw new HttpError(400, `"${field}" must be a valid email address`);
  return email;
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  // Malformed JSON body from express.json()
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
