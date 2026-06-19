const { body } = require('express-validator');

// Shared field rules per the assignment spec.
const nameRule = body('name')
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters.');

const emailRule = body('email')
  .trim()
  .isEmail()
  .withMessage('A valid email address is required.')
  .normalizeEmail();

const addressRule = body('address')
  .trim()
  .isLength({ max: 400 })
  .withMessage('Address must be at most 400 characters.');

// 8-16 chars, at least one uppercase and one special character.
const passwordRule = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8-16 characters.')
  .matches(/[A-Z]/)
  .withMessage('Password must include at least one uppercase letter.')
  .matches(/[^A-Za-z0-9]/)
  .withMessage('Password must include at least one special character.');

const roleRule = body('role')
  .optional()
  .isIn(['admin', 'user', 'owner'])
  .withMessage('Role must be one of admin, user, owner.');

module.exports = {
  nameRule,
  emailRule,
  addressRule,
  passwordRule,
  roleRule,
};
