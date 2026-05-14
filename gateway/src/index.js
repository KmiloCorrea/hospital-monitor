require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());
app.use(morgan('dev'));

const services = {
  '/api/auth':      'http://localhost:3001',
  '/api/users':     'http://localhost:3002',
  '/api/devices':   'http://localhost:3003',
  '/api/locations': 'http://localhost:3004',
  '/api/metrics':   'http://localhost:3005',
  '/api/alerts':    'http://localhost:3006',
};

Object.entries(services).forEach(([path, target]) => {
  app.use(path, createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error(`[Gateway] Error proxy ${path}:`, err.message);
        res.status(503).json({ success: false, message: `Servicio no disponible` });
      }
    }
  }));
});

app.get('/health', (req, res) => {
  res.json({ gateway: 'running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[API Gateway] Corriendo en puerto ${PORT}`);
});