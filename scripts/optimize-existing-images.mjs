#!/usr/bin/env node

/**
 * Migration script: Convert existing Supabase Storage images to AVIF
 *
 * Usage:
 *   node scripts/optimize-existing-images.mjs
 *
 * Environment variables (from .env.local):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * What it does:
 *   1. Lists all files in each bucket (projects, achievements, certificates, project-screenshots, blogs)
 *   2. Skips files that already have an AVIF counterpart
 *   3. Downloads each image, converts to AVIF using sharp
 *   4. Uploads the AVIF version alongside the original (same folder, .avif extension)
 *   5. Updates database records to point to the AVIF URL
 *   6. Reports summary of converted/skipped/failed images
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (SvelteKit style)
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '..', '.env.local');
    const content = readFileSync(envPath, 'utf-8');
    const env = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      // Remove surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
    return env;
  } catch {
    return {};
  }
}

const env = { ...process.env, ...loadEnv() };

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKETS = ['projects', 'achievements', 'certificates', 'project-screenshots', 'blogs'];
const CONCURRENCY = 3; // parallel conversions

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!env.DATABASE_URL && !env.POSTGRES_URL) {
  console.error('⚠️  Warning: Missing DATABASE_URL — will skip DB updates');
}

const cleanUrl = SUPABASE_URL.trim().replace(/\/$/, '');
const cleanKey = SUPABASE_KEY.trim();

// ── Supabase helpers ──────────────────────────────────────────

async function listFiles(bucket, prefix = '', offset = 0, limit = 100) {
  const res = await fetch(`${cleanUrl}/storage/v1/object/list/${bucket}`, {
    method: 'POST',
    headers: {
      apikey: cleanKey,
      Authorization: `Bearer ${cleanKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prefix, limit, offset, sortBy: { column: 'name', order: 'asc' } })
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`   ⚠️  List failed for ${bucket}/${prefix}: ${res.status} ${err}`);
    return [];
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function listAllFiles(bucket) {
  return listAllFilesByPrefix(bucket, '');
}

async function listAllFilesByPrefix(bucket, prefix) {
  let all = [];
  let offset = 0;
  while (true) {
    const batch = await listFiles(bucket, prefix, offset);
    if (batch.length === 0) break;
    for (const item of batch) {
      const fullPath = prefix + item.name;
      if (item.id === null) {
        // It's a folder — recurse into it
        const subFiles = await listAllFilesByPrefix(bucket, fullPath + '/');
        all = all.concat(subFiles);
      } else {
        all.push({ ...item, fullPath });
      }
    }
    if (batch.length < 100) break;
    offset += 100;
  }
  return all;
}

async function downloadFile(bucket, path) {
  const res = await fetch(`${cleanUrl}/storage/v1/object/${bucket}/${path}`, {
    headers: { apikey: cleanKey, Authorization: `Bearer ${cleanKey}` }
  });
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

async function uploadFile(bucket, path, buffer, contentType) {
  const res = await fetch(`${cleanUrl}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: cleanKey,
      Authorization: `Bearer ${cleanKey}`,
      'Content-Type': contentType,
      'x-upsert': 'true'
    },
    body: buffer
  });
  return res.ok;
}

// ── Image conversion ──────────────────────────────────────────

async function convertToAvif(inputBuffer) {
  // Dynamic import of sharp (ESM)
  const sharp = (await import('sharp')).default;
  return sharp(inputBuffer)
    .avif({ quality: 65, effort: 6, chromaSubsampling: '4:2:0' })
    .toBuffer();
}

// ── Database helpers ──────────────────────────────────────────

let _dbPool = null;

async function getDbPool() {
  if (_dbPool) return _dbPool;
  const { Pool } = await import('pg');
  _dbPool = new Pool({
    connectionString: env.DATABASE_URL || env.POSTGRES_URL,
    max: 5
  });
  return _dbPool;
}

async function queryDatabase(sql, params = []) {
  const pool = await getDbPool();
  return pool.query(sql, params);
}

async function closeDb() {
  if (_dbPool) {
    await _dbPool.end();
    _dbPool = null;
  }
}

async function updateDbUrl(oldUrl, newUrl) {
  const tables = [
    { table: 'projects', column: 'image_url' },
    { table: 'achievements', column: 'image_url' },
    { table: 'certificates', column: 'image_url' },
    { table: 'blog_images', column: 'storage_url' }
  ];

  let totalUpdated = 0;
  for (const { table, column } of tables) {
    try {
      const result = await queryDatabase(
        `UPDATE ${table} SET ${column} = $1, updated_at = CURRENT_TIMESTAMP WHERE ${column} = $2`,
        [newUrl, oldUrl]
      );
      totalUpdated += result.rowCount || 0;
    } catch {
      // Table might not exist or column mismatch — skip silently
    }
  }
  return totalUpdated;
}

// ── Main migration ────────────────────────────────────────────

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function getExtension(filename) {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot).toLowerCase();
}

function getBaseName(filename) {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? filename : filename.slice(0, dot);
}

function publicUrl(bucket, path) {
  return `${cleanUrl}/storage/v1/object/public/${bucket}/${path}`;
}

async function processFile(bucket, file, filePath) {
  const ext = getExtension(file.name);
  const baseName = getBaseName(file.name);

  // Skip non-image files
  if (!IMAGE_EXTENSIONS.has(ext)) return { status: 'skipped', reason: 'not an image', file: filePath };

  const avifName = `${baseName}.avif`;
  const avifPath = filePath.replace(file.name, avifName);

  // Check if AVIF version already exists
  const existingAvif = await listFiles(bucket, avifPath);
  if (existingAvif.some(f => f.name === avifName)) {
    return { status: 'skipped', reason: 'avif exists', file: filePath };
  }

  // Download original
  const originalBuffer = await downloadFile(bucket, filePath);
  if (!originalBuffer) {
    return { status: 'failed', reason: 'download failed', file: filePath };
  }

  // Convert to AVIF
  let avifBuffer;
  try {
    avifBuffer = await convertToAvif(originalBuffer);
  } catch (err) {
    return { status: 'failed', reason: `convert error: ${err.message}`, file: filePath };
  }

  // Upload AVIF
  const uploaded = await uploadFile(bucket, avifPath, avifBuffer, 'image/avif');
  if (!uploaded) {
    return { status: 'failed', reason: 'upload failed', file: filePath };
  }

  // Update database
  const oldUrl = publicUrl(bucket, filePath);
  const newUrl = publicUrl(bucket, avifPath);
  const updated = await updateDbUrl(oldUrl, newUrl);

  const originalKB = (originalBuffer.length / 1024).toFixed(1);
  const avifKB = (avifBuffer.length / 1024).toFixed(1);
  const savings = ((1 - avifBuffer.length / originalBuffer.length) * 100).toFixed(0);

  return {
    status: 'converted',
    file: filePath,
    avif: avifPath,
    original: `${originalKB}KB`,
    avifSize: `${avifKB}KB`,
    savings: `${savings}%`,
    dbUpdated: updated
  };
}

async function processBucket(bucket) {
  console.log(`\n📦 Processing bucket: ${bucket}`);

  const files = await listAllFiles(bucket);
  if (files.length === 0) {
    console.log('   No files found.');
    return { converted: 0, skipped: 0, failed: 0 };
  }

  console.log(`   Found ${files.length} files`);

  const stats = { converted: 0, skipped: 0, failed: 0 };

  // Process in batches
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(f => processFile(bucket, f, f.fullPath)));

    for (const r of results) {
      if (r.status === 'converted') {
        stats.converted++;
        console.log(`   ✅ ${r.file} → ${r.avif} (${r.original} → ${r.avifSize}, -${r.savings}${r.dbUpdated > 0 ? `, ${r.dbUpdated} DB rows updated` : ''})`);
      } else if (r.status === 'skipped') {
        stats.skipped++;
        console.log(`   ⏭️  ${r.file} (${r.reason})`);
      } else {
        stats.failed++;
        console.error(`   ❌ ${r.file} (${r.reason})`);
      }
    }
  }

  return stats;
}

// ── Entry point ───────────────────────────────────────────────

async function main() {
  console.log('🚀 AVIF Image Migration');
  console.log(`   Buckets: ${BUCKETS.join(', ')}`);
  console.log('');

  let totalConverted = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const bucket of BUCKETS) {
    const stats = await processBucket(bucket);
    totalConverted += stats.converted;
    totalSkipped += stats.skipped;
    totalFailed += stats.failed;
  }

  console.log('\n' + '─'.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ Converted: ${totalConverted}`);
  console.log(`   ⏭️  Skipped:   ${totalSkipped}`);
  console.log(`   ❌ Failed:    ${totalFailed}`);
  console.log('─'.repeat(50));

  await closeDb();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
