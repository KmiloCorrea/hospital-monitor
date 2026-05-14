const { Pool } = require('pg');

const pool = new Pool({
  host:     'localhost',
  port:     5433,
  database: 'hospital_monitor',
  user:     'postgres',
  password: '123456',
});

pool.on('connect', () => {
  console.log('[Servicio] Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('[Servicio] Error BD:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};