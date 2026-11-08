import Anthropic from '@anthropic-ai/sdk';
import { Router, type Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { config } from '../config.js';
import { query } from '../db/pool.js';
import { HttpError } from '../lib/http.js';

const MAX_HISTORY = 20;
const MAX_MESSAGE_LENGTH = 2000;

const LANGUAGES = { en: 'English', hy: 'Armenian', ru: 'Russian' } as const;
type LanguageCode = keyof typeof LANGUAGES;

/** Error codes the client translates into the shopper's language. */
type ChatErrorCode = 'not_configured' | 'busy' | 'unavailable' | 'refused' | 'generic';

let client: Anthropic | null = null;
/** Created lazily so the API still boots when chat credentials aren't configured. */
function getClient(): Anthropic {
  client ??= new Anthropic();
  return client;
}

interface CatalogRow {
  id: number;
  name: string;
  currentPrice: number;
  originalPrice: number;
  brand: string | null;
  category: string | null;
  rating: number;
  type: string;
}

async function buildSystemPrompt(language: LanguageCode): Promise<string> {
  const products = await query<CatalogRow>(
    `SELECT id, name, current_price AS "currentPrice", original_price AS "originalPrice",
            brand, category, rating, type
     FROM products WHERE owner IS NULL ORDER BY id`,
  );
  const catalog = products
    .map(
      (p) =>
        `- #${p.id} ${p.name}: $${p.currentPrice.toFixed(2)} (was $${p.originalPrice.toFixed(2)})` +
        `${p.brand ? `, brand ${p.brand}` : ''}${p.category ? `, category ${p.category}` : ''}` +
        `, rating ${p.rating}/5, page /products/${p.id}`,
    )
    .join('\n');

  return `You are the customer support assistant for Heckto, an online store selling tech, fashion, beauty and home products.

Help shoppers with general questions: finding and comparing products, prices, shipping, payment, the cart and accounts. Keep replies short and friendly (a few sentences or a short list), in plain text without markdown headings.

The shopper chose ${LANGUAGES[language]} in the chat. Reply in ${LANGUAGES[language]}, unless the shopper clearly writes in a different language, then reply in theirs. Keep product names, prices and page paths as they are.

Store facts you can rely on:
- Shipping is a flat $100 per order, added at checkout.
- The cart is kept in the shopper's browser; quantities can be changed or the cart cleared on the cart page (/basket).
- Payment is by card on the product page ("Add To Cart" opens the card form).
- Accounts: sign in or create an account on /login.
- Human support: email mhhasanul@gmail.com or call (12345)67890.

Current catalog (only these products exist; prices in USD):
${catalog}

When you mention a product, include its page path (for example /products/3) so the shopper can open it. If a question needs information you don't have here, such as order status, refunds, delivery times or a specific order, say you can't see that and point the shopper to human support. Don't invent policies, discounts or products.`;
}

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function parseLanguage(body: unknown): LanguageCode {
  const value = (body as { language?: unknown } | undefined)?.language;
  return typeof value === 'string' && value in LANGUAGES ? (value as LanguageCode) : 'en';
}

function parseMessages(body: unknown): ChatMessage[] {
  const raw = (body as { messages?: unknown } | undefined)?.messages;
  if (!Array.isArray(raw) || raw.length === 0) throw new HttpError(400, '"messages" must be a non-empty array');

  const messages = raw.map((m, i): ChatMessage => {
    const { role, content } = (m ?? {}) as { role?: unknown; content?: unknown };
    if (role !== 'user' && role !== 'assistant') throw new HttpError(400, `messages[${i}].role is invalid`);
    if (typeof content !== 'string' || !content.trim()) throw new HttpError(400, `messages[${i}].content is required`);
    if (content.length > MAX_MESSAGE_LENGTH) {
      throw new HttpError(400, `Messages must be at most ${MAX_MESSAGE_LENGTH} characters`);
    }
    return { role, content: content.trim() };
  });

  // Keep the most recent turns, starting on a user message.
  let recent = messages.slice(-MAX_HISTORY);
  while (recent.length && recent[0]!.role !== 'user') recent = recent.slice(1);
  if (!recent.length || recent[recent.length - 1]!.role !== 'user') {
    throw new HttpError(400, 'The last message must be from the user');
  }
  return recent;
}

function sendEvent(res: Response, data: Record<string, unknown>) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function errorCode(err: unknown): ChatErrorCode {
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
    return 'not_configured';
  }
  if (err instanceof Anthropic.RateLimitError) return 'busy';
  if (err instanceof Anthropic.APIConnectionError) return 'unavailable';
  if (err instanceof Anthropic.APIError) return 'generic';
  // e.g. no credentials could be resolved when creating the client
  if (err instanceof Anthropic.AnthropicError) return 'not_configured';
  return 'generic';
}

export const chatRouter = Router();

chatRouter.use(
  rateLimit({
    windowMs: 60_000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many messages, please slow down.', code: 'rate_limited' },
  }),
);

/**
 * POST /api/chat { messages: [{ role, content }], language?: 'en' | 'hy' | 'ru' }
 * Streams the reply as Server-Sent Events:
 *   data: {"type":"delta","text":"..."}   (repeated)
 *   data: {"type":"done"} | {"type":"error","code":"busy"}
 */
chatRouter.post('/', async (req, res) => {
  const messages = parseMessages(req.body);
  const system = await buildSystemPrompt(parseLanguage(req.body));

  res.status(200).set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  let stream: ReturnType<Anthropic['beta']['messages']['stream']> | null = null;
  res.on('close', () => {
    if (!res.writableEnded) stream?.abort();
  });

  try {
    stream = getClient().beta.messages.stream({
      model: config.chatModel,
      max_tokens: 4096, // short support replies; caps cost per message
      output_config: { effort: 'low' },
      // On a safety decline, the API re-runs the request on a recommended fallback model.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        sendEvent(res, { type: 'delta', text: event.delta.text });
      }
    }

    const final = await stream.finalMessage();
    if (final.stop_reason === 'refusal') {
      sendEvent(res, { type: 'error', code: 'refused' satisfies ChatErrorCode });
    } else {
      sendEvent(res, { type: 'done' });
    }
  } catch (err) {
    if (err instanceof Anthropic.APIUserAbortError) return; // client went away
    console.error('Chat error:', err);
    sendEvent(res, { type: 'error', code: errorCode(err) });
  } finally {
    res.end();
  }
});
