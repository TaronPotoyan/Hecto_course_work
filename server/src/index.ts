import { config } from './config.js';
import { createApp } from './app.js';
import { pool } from './db/pool.js';

// Validate required settings at startup rather than on first request.
void config.jwtSecret;

const server = createApp().listen(config.port, () => {
  console.log(`Heckto API listening on http://localhost:${config.port}`);
});

async function shutdown() {
  server.close();
  await pool.end();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
