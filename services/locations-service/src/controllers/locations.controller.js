const db = require('../models/db');

exports.getAll = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT l.*, COUNT(d.id) as device_count
       FROM locations l LEFT JOIN devices d ON l.id = d.location_id
       GROUP BY l.id ORDER BY l.building, l.floor, l.name`
    );
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener ubicaciones' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM locations WHERE id=$1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Ubicacion no encontrada' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT d.*, dt.name as type_name, dt.icon FROM devices d
       LEFT JOIN device_types dt ON d.device_type_id = dt.id
       WHERE d.location_id = $1 ORDER BY d.is_critical DESC, d.name`,
      [req.params.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, floor, building, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nombre requerido' });
    const result = await db.query(
      'INSERT INTO locations (name, floor, building, description) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, floor, building, description]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al crear' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, floor, building, description } = req.body;
    const result = await db.query(
      'UPDATE locations SET name=$1, floor=$2, building=$3, description=$4, updated_at=NOW() WHERE id=$5 RETURNING *',
      [name, floor, building, description, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'No encontrada' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al actualizar' });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM locations WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Ubicacion eliminada' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
};
