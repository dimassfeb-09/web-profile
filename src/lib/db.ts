import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

function createPool(): Pool {
  if (!process.env.DATABASE_URL) {
    // Return a dummy pool that will throw when query is called
    return {
      query: () => {
        throw new Error('DATABASE_URL is not set. Please configure your database connection.');
      }
    } as unknown as Pool;
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
  });
}

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = createPool();
} else {
  // Prevent multiple pools during hot-reload in development
  if (!global.pgPool) {
    global.pgPool = createPool();
  }
  pool = global.pgPool;
}

export default pool;
