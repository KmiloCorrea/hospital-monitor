const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/locations.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/',          verifyToken, ctrl.getAll);
router.get('/:id',       verifyToken, ctrl.getById);
router.get('/:id/devices', verifyToken, ctrl.getDevices);
router.post('/',         verifyToken, requireRole('admin'), ctrl.create);
router.put('/:id',       verifyToken, requireRole('admin'), ctrl.update);
router.delete('/:id',    verifyToken, requireRole('admin'), ctrl.remove);

module.exports = router;
