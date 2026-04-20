import { Pool } from 'pg';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Adding slug column and history table...');
    await pool.query(`ALTER TABLE achievements ADD COLUMN IF NOT EXISTS slug VARCHAR(255)`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS achievement_slug_history (
        id SERIAL PRIMARY KEY,
        achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
        old_slug VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Fetching achievements...');
    const { rows: achievements } = await pool.query('SELECT id, title FROM achievements WHERE slug IS NULL');
    
    console.log(`Found ${achievements.length} achievements to migrate.`);
    
    // To handle duplicates
    const slugCounts: Record<string, number> = {};
    const existingSlugs = new Set((await pool.query('SELECT slug FROM achievements WHERE slug IS NOT NULL')).rows.map(r => r.slug));

    for (const achievement of achievements) {
      let baseSlug = slugify(achievement.title || 'achievement');
      if (!baseSlug) baseSlug = 'achievement';
      
      let finalSlug = baseSlug;
      let counter = 2;
      
      while (existingSlugs.has(finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      existingSlugs.add(finalSlug);
      
      await pool.query('UPDATE achievements SET slug = $1 WHERE id = $2', [finalSlug, achievement.id]);
      console.log(`Updated [${achievement.id}] with slug: ${finalSlug}`);
    }

    console.log('Adding constraints and indexes...');
    await pool.query(`ALTER TABLE achievements ALTER COLUMN slug SET NOT NULL`);
    
    // Add unique constraint only if it doesn't exist
    const { rowCount } = await pool.query(`
      SELECT 1 FROM pg_constraint WHERE conname = 'achievements_slug_unique'
    `);
    
    if (rowCount === 0) {
      await pool.query(`ALTER TABLE achievements ADD CONSTRAINT achievements_slug_unique UNIQUE (slug)`);
    }

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_achievements_slug ON achievements(slug)`);
    console.log('Migration completed successfully!');

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
