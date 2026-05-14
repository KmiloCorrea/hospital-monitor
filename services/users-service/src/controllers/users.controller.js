const bcrypt = require('bcryptjs');
const db = require('../models/db');

exports.getAll = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.full_name, u.email, u.is_active, u.last_login, u.created_at,
              r.name as role FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.full_name, u.email, u.is_active, u.last_login, r.name as role
       FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener usuario' });
  }
};

exports.create = async (req, res) => {
  try {
    const { full_name, email, password, role_id } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (full_name, email, password_hash, role_id) VALUES ($1,$2,$3,$4) RETURNING id, full_name, email`,
      [full_name, email, hash, role_id]
    );
    res.status(201).json({ success: true, message: 'Usuario creado', data: result.rows[0] });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ success: false, message: 'Email ya registrado' });
    res.status(500).json({ success: false, message: 'Error al crear usuario' });
  }
};

exports.update = async (req, res) => {
  try {
    const { full_name, email, role_id, is_active } = req.body;
    const result = await db.query(
      `UPDATE users SET full_name=$1, email=$2, role_id=$3, is_active=$4, updated_at=NOW()
       WHERE id=$5 RETURNING id, full_name, email, is_active`,
      [full_name, email, role_id, is_active, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al actualizar' });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('UPDATE users SET is_active=false WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Usuario desactivado' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM roles ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener roles' });
  }
};
