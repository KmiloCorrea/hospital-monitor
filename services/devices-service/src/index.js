require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const devicesRoutes = require('./routes/devices.routes');

const app = express();
const PORT = process.env.DEVICES_SERVICE_PORT || 3003;
app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => res.json({ service: 'devices-service', status: 'running', timestamp: new Date().toISOString() }));
app.use('/api/devices', devicesRoutes);
app.listen(PORT, () => console.log(`[Devices Service] Corriendo en puerto ${PORT}`));
module.exports = app;
