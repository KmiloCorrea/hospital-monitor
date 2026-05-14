// ============================================
// Rutas de Autenticacion
// ============================================
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', verifyToken, authController.logout);

// GET /api/auth/me  (obtener usuario actual)
router.get('/me', verifyToken, authController.me);

// POST /api/auth/refresh
router.post('/refresh', authController.refresh);

module.exports = router;
