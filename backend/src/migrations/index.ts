import fs from 'fs'
import path from 'path'
import { Client } from 'pg'
import { getDbConfig } from '../services/config.service'
import { fileURLToPath } from 'url'

const client = new Client(getDbConfig())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MIGRATION_FOLDER = __dirname

async function runMigrations(): Promise<void> {
  await client.connect()

  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      run_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)

  const files: string[] = fs
    .readdirSync(MIGRATION_FOLDER)
    .filter((file): file is string => file.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const { rows } = await client.query(
      `SELECT * FROM migrations WHERE name = $1`,
      [file],
    )

    if (rows.length === 0) {
      const sql = fs.readFileSync(path.join(MIGRATION_FOLDER, file), 'utf8')
      console.log(`Running migration: ${file}`)
      await client.query(sql)
      await client.query(`INSERT INTO migrations (name) VALUES ($1)`, [file])
    } else {
      console.log(`Skipping already run migration: ${file}`)
    }
  }

  await client.end()
  console.log('✅ All migrations complete')
}

runMigrations().catch((err: unknown) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
