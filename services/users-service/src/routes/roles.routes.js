const express = require('express');
const pool = require('../config/database');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', verifyJWT, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roles ORDER BY id');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener roles' });
  }
});

router.post('/', verifyJWT, async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(400).json({ error: 'Rol ya existe' });
    res.status(500).json({ error: 'Error al crear rol' });
  }
});

module.exports = router;
