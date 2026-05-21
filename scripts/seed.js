require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hospital_monitor',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function seed() {
  const seedDir = path.join(__dirname, '../database/seeds');
  const files = fs.readdirSync(seedDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(seedDir, file), 'utf8');
    await pool.query(sql);
    console.log(`[Seed] OK: ${file}`);
  }

  const adminRole = await pool.query("SELECT id FROM roles WHERE name='admin'");
  if (adminRole.rows.length > 0) {
    const hash = await bcrypt.hash('Admin1234!', 10);
    await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role_id)
       VALUES ('Administrador TI', 'admin@husrt.gov.co', $1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [hash, adminRole.rows[0].id]
    );
    console.log('[Seed] Usuario admin creado: admin@husrt.gov.co / Admin1234!');
  }

  console.log('[Seed] Datos iniciales cargados.');
  await pool.end();
}

seed().catch(console.error);
