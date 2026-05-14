const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/',           verifyToken, usersController.getAll);
router.get('/:id',        verifyToken, usersController.getById);
router.post('/',          verifyToken, requireRole('admin'), usersController.create);
router.put('/:id',        verifyToken, requireRole('admin'), usersController.update);
router.delete('/:id',     verifyToken, requireRole('admin'), usersController.remove);
router.get('/roles/all',  verifyToken, usersController.getRoles);

module.exports = router;
