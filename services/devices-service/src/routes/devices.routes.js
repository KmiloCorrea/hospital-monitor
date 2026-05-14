const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/devices.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/',                verifyToken, ctrl.getAll);
router.get('/types',           verifyToken, ctrl.getTypes);
router.get('/:id',             verifyToken, ctrl.getById);
router.post('/',               verifyToken, requireRole('admin', 'technician'), ctrl.create);
router.put('/:id',             verifyToken, requireRole('admin', 'technician'), ctrl.update);
router.patch('/:id/status',    verifyToken, requireRole('admin', 'technician'), ctrl.updateStatus);
router.delete('/:id',          verifyToken, requireRole('admin'), ctrl.remove);

module.exports = router;
