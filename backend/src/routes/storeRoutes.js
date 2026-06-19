const express = require('express');
const { body } = require('express-validator');
const {
  createStore,
  listStores,
  getOwnerDashboard,
} = require('../controllers/storeController');
const { submitRating } = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');
const { emailRule, addressRule } = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

// Store owner dashboard.
router.get('/owner/dashboard', authorize('owner'), getOwnerDashboard);

// Browse stores (admin + normal user + owner all may view).
router.get('/', listStores);

// Admin: create store.
router.post(
  '/',
  authorize('admin'),
  [
    body('name').trim().isLength({ min: 1, max: 60 }).withMessage('Store name is required (max 60 chars).'),
    emailRule,
    addressRule,
    body('ownerId').optional({ nullable: true }).isInt().withMessage('ownerId must be an integer.'),
  ],
  handleValidation,
  createStore
);

// Normal user: submit/modify a rating.
router.post(
  '/:storeId/ratings',
  authorize('user'),
  [body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.')],
  handleValidation,
  submitRating
);

module.exports = router;
