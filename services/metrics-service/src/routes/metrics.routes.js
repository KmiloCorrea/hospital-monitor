const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/metrics.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/types',              verifyToken, ctrl.getTypes);
router.get('/device/:deviceId',   verifyToken, ctrl.getByDevice);
router.get('/device/:deviceId/latest', verifyToken, ctrl.getLatestByDevice);
router.get('/summary',            verifyToken, ctrl.getSummary);
router.post('/',                  verifyToken, requireRole('admin', 'technician'), ctrl.record);
router.post('/bulk',              verifyToken, requireRole('admin', 'technician'), ctrl.recordBulk);

module.exports = router;
