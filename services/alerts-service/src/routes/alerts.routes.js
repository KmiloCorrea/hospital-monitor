const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/alerts.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/',                 verifyToken, ctrl.getAll);
router.get('/active',           verifyToken, ctrl.getActive);
router.get('/severities',       verifyToken, ctrl.getSeverities);
router.get('/stats',            verifyToken, ctrl.getStats);
router.get('/:id',              verifyToken, ctrl.getById);
router.post('/',                verifyToken, requireRole('admin', 'technician'), ctrl.create);
router.patch('/:id/resolve',    verifyToken, requireRole('admin', 'technician'), ctrl.resolve);
router.delete('/:id',           verifyToken, requireRole('admin'), ctrl.remove);

module.exports = router;
