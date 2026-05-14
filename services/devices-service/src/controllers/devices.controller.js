const db = require('../models/db');

exports.getAll = async (req, res) => {
  try {
    const { status, location_id, type_id } = req.query;
    let query = `
      SELECT d.*, dt.name as type_name, dt.icon as type_icon, l.name as location_name
      FROM devices d
      LEFT JOIN device_types dt ON d.device_type_id = dt.id
      LEFT JOIN locations l ON d.location_id = l.id
      WHERE 1=1`;
    const params = [];
    if (status) { params.push(status); query += ` AND d.status = $${params.length}`; }
    if (location_id) { params.push(location_id); query += ` AND d.location_id = $${params.length}`; }
    if (type_id) { params.push(type_id); query += ` AND d.device_type_id = $${params.length}`; }
    query += ' ORDER BY d.is_critical DESC, d.name ASC';
    const result = await db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener dispositivos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT d.*, dt.name as type_name, l.name as location_name, l.floor, l.building
       FROM devices d
       LEFT JOIN device_types dt ON d.device_type_id = dt.id
       LEFT JOIN locations l ON d.location_id = l.id
       WHERE d.id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Dispositivo no encontrado' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener dispositivo' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, hostname, ip_address, mac_address, device_type_id, location_id, serial_number, manufacturer, model, os_version, notes, is_critical } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'El nombre es requerido' });
    const result = await db.query(
      `INSERT INTO devices (name, hostname, ip_address, mac_address, device_type_id, location_id, serial_number, manufacturer, model, os_version, notes, is_critical)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [name, hostname, ip_address, mac_address, device_type_id, location_id, serial_number, manufacturer, model, os_version, notes, is_critical || false]
    );
    res.status(201).json({ success: true, message: 'Dispositivo creado', data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al crear dispositivo' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, hostname, ip_address, mac_address, device_type_id, location_id, serial_number, manufacturer, model, os_version, notes, is_critical } = req.body;
    const result = await db.query(
      `UPDATE devices SET name=$1, hostname=$2, ip_address=$3, mac_address=$4, device_type_id=$5,
       location_id=$6, serial_number=$7, manufacturer=$8, model=$9, os_version=$10, notes=$11, is_critical=$12, updated_at=NOW()
       WHERE id=$13 RETURNING *`,
      [name, hostname, ip_address, mac_address, device_type_id, location_id, serial_number, manufacturer, model, os_version, notes, is_critical, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al actualizar' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['online', 'offline', 'warning', 'unknown'];
    if (!valid.includes(status)) return res.status(400).json({ success: false, message: 'Estado inválido' });
    const result = await db.query(
      'UPDATE devices SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING id, name, status',
      [status, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM devices WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Dispositivo eliminado' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
};

exports.getTypes = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM device_types ORDER BY name');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener tipos' });
  }
};
