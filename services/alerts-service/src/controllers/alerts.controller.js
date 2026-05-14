const db = require('../models/db');

exports.getAll = async (req, res) => {
  try {
    const { is_resolved, severity_id, limit = 50 } = req.query;
    let query = `
      SELECT a.*, s.name as severity_name, s.color_hex,
             d.name as device_name, d.ip_address,
             u.full_name as resolved_by_name
      FROM alerts a
      LEFT JOIN alert_severities s ON a.severity_id = s.id
      LEFT JOIN devices d ON a.device_id = d.id
      LEFT JOIN users u ON a.resolved_by = u.id
      WHERE 1=1`;
    const params = [];
    if (is_resolved !== undefined) { params.push(is_resolved === 'true'); query += ` AND a.is_resolved=$${params.length}`; }
    if (severity_id) { params.push(severity_id); query += ` AND a.severity_id=$${params.length}`; }
    query += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));
    const result = await db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener alertas' });
  }
};

exports.getActive = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, s.name as severity_name, s.color_hex, s.priority,
              d.name as device_name, d.ip_address, d.is_critical
       FROM alerts a
       LEFT JOIN alert_severities s ON a.severity_id = s.id
       LEFT JOIN devices d ON a.device_id = d.id
       WHERE a.is_resolved = false
       ORDER BY s.priority ASC, a.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

exports.getSeverities = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alert_severities ORDER BY priority');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
         COUNT(*) FILTER (WHERE is_resolved = false) as active_total,
         COUNT(*) FILTER (WHERE is_resolved = false AND severity_id = (SELECT id FROM alert_severities WHERE name='emergency')) as emergency,
         COUNT(*) FILTER (WHERE is_resolved = false AND severity_id = (SELECT id FROM alert_severities WHERE name='critical')) as critical,
         COUNT(*) FILTER (WHERE is_resolved = false AND severity_id = (SELECT id FROM alert_severities WHERE name='warning')) as warning,
         COUNT(*) FILTER (WHERE is_resolved = false AND severity_id = (SELECT id FROM alert_severities WHERE name='info')) as info,
         COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as last_24h
       FROM alerts`
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, s.name as severity_name, s.color_hex, d.name as device_name
       FROM alerts a
       LEFT JOIN alert_severities s ON a.severity_id = s.id
       LEFT JOIN devices d ON a.device_id = d.id
       WHERE a.id = $1`, [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Alerta no encontrada' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { device_id, severity_id, title, message } = req.body;
    if (!title || !message || !severity_id) {
      return res.status(400).json({ success: false, message: 'Titulo, mensaje y severidad son requeridos' });
    }
    const result = await db.query(
      'INSERT INTO alerts (device_id, severity_id, title, message) VALUES ($1,$2,$3,$4) RETURNING *',
      [device_id, severity_id, title, message]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al crear alerta' });
  }
};

exports.resolve = async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE alerts SET is_resolved=true, resolved_by=$1, resolved_at=NOW(), updated_at=NOW()
       WHERE id=$2 RETURNING *`,
      [req.user.userId, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'No encontrada' });
    res.json({ success: true, message: 'Alerta resuelta', data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al resolver' });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM alerts WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: 'Alerta eliminada' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
};
