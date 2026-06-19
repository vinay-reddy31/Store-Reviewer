const express = require('express');
const { body } = require('express-validator');
const { signup, login, me, updatePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');
const { nameRule, emailRule, addressRule, passwordRule } = require('../utils/validators');

const router = express.Router();

router.post('/signup', [nameRule, emailRule, addressRule, passwordRule], handleValidation, signup);

router.post(
  '/login',
  [body('email').trim().isEmail().withMessage('A valid email is required.'),
   body('password').notEmpty().withMessage('Password is required.')],
  handleValidation,
  login
);

router.get('/me', authenticate, me);

router.put(
  '/password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required.'),
    body('newPassword')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be 8-16 characters.')
      .matches(/[A-Z]/)
      .withMessage('Password must include at least one uppercase letter.')
      .matches(/[^A-Za-z0-9]/)
      .withMessage('Password must include at least one special character.'),
  ],
  handleValidation,
  updatePassword
);

module.exports = router;
