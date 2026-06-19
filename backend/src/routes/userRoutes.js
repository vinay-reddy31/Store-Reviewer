const express = require('express');
const {
  getDashboardStats,
  createUser,
  listUsers,
  getUser,
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');
const { nameRule, emailRule, addressRule, passwordRule, roleRule } = require('../utils/validators');

const router = express.Router();

// All admin-only.
router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/', listUsers);
router.get('/:id', getUser);
router.post(
  '/',
  [nameRule, emailRule, addressRule, passwordRule, roleRule],
  handleValidation,
  createUser
);

module.exports = router;
