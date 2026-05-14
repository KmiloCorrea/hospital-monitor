const db = require('../models/db');

exports.getTypes = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM metric_types ORDER BY name');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

exports.getByDevice = async (req, res) => {
  try {
    const { metric_type_id, hours = 24, limit = 100 } = req.query;
    const since = new Date(Date.now() - hours * 3600000);
    let query = `
      SELECT m.*, mt.name as metric_name, mt.unit
      FROM metrics m LEFT JOIN metric_types mt ON m.metric_type_id = mt.id
      WHERE m.device_id = $1 AND m.recorded_at >= $2`;
    const params = [req.params.deviceId, since];
    if (metric_type_id) { params.push(metric_type_id); query += ` AND m.metric_type_id = $${params.length}`; }
    query += ` ORDER BY m.recorded_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));
    const result = await db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener métricas' });
  }
};

exports.getLatestByDevice = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT ON (m.metric_type_id)
         m.*, mt.name as metric_name, mt.unit, mt.threshold_warning, mt.threshold_critical
       FROM metrics m LEFT JOIN metric_types mt ON m.metric_type_id = mt.id
       WHERE m.device_id = $1
       ORDER BY m.metric_type_id, m.recorded_at DESC`,
      [req.params.deviceId]
    );
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener últimas métricas' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT d.id, d.name, d.status,
         json_agg(json_build_object(
           'metric', mt.name, 'value', latest.value, 'unit', mt.unit,
           'warning', mt.threshold_warning, 'critical', mt.threshold_critical
         )) as metrics
       FROM devices d
       LEFT JOIN LATERAL (
         SELECT m.metric_type_id, m.value
         FROM metrics m WHERE m.device_id = d.id
         ORDER BY m.recorded_at DESC LIMIT 10
       ) latest ON true
       LEFT JOIN metric_types mt ON latest.metric_type_id = mt.id
       GROUP BY d.id ORDER BY d.is_critical DESC, d.name`
    );
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al obtener resumen' });
  }
};

exports.record = async (req, res) => {
  try {
    const { device_id, metric_type_id, value } = req.body;
    if (!device_id || !metric_type_id || value === undefined) {
      return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }
    const result = await db.query(
      'INSERT INTO metrics (device_id, metric_type_id, value) VALUES ($1,$2,$3) RETURNING *',
      [device_id, metric_type_id, value]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al registrar métrica' });
  }
};

exports.recordBulk = async (req, res) => {
  try {
    const { metrics } = req.body; // array of {device_id, metric_type_id, value}
    if (!Array.isArray(metrics) || metrics.length === 0) {
      return res.status(400).json({ success: false, message: 'Se esperaba un array de métricas' });
    }
    const values = metrics.map((m, i) => `($${i*3+1}, $${i*3+2}, $${i*3+3})`).join(',');
    const params = metrics.flatMap(m => [m.device_id, m.metric_type_id, m.value]);
    await db.query(`INSERT INTO metrics (device_id, metric_type_id, value) VALUES ${values}`, params);
    res.status(201).json({ success: true, message: `${metrics.length} métricas registradas` });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error en bulk insert' });
  }
};
