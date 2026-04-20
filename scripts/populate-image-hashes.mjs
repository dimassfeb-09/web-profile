import pkg from 'pg';
import crypto from 'crypto';

const { Pool } = pkg;
const p = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const tables = ['achievements', 'projects', 'certificates'];
    for (const table of tables) {
      const { rows } = await p.query(`SELECT id, image_url FROM ${table} WHERE image_url IS NOT NULL`);
      for (const row of rows) {
        const hash = crypto.createHash('sha256').update(row.image_url).digest('hex').slice(0, 8);
        await p.query(`UPDATE ${table} SET image_hash = $1 WHERE id = $2`, [hash, row.id]);
      }
      console.log(`Updated ${table}`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await p.end();
  }
}

run();
