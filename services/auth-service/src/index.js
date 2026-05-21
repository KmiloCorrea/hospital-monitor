require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'auth-service', status: 'running', timestamp: new Date().toISOString() });
});

// Rutas
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`[Auth Service] Corriendo en puerto ${PORT}`);
});

module.exports = app;
