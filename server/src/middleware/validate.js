const { check, validationResult } = require('express-validator');

const validateProduct = [
  check('name').notEmpty().withMessage('Name is required').trim(),
  check('category')
    .isIn(['gold', 'silver'])
    .withMessage('Category must be gold or silver'),
  check('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  check('weight').optional({ checkFalsy: true }).trim(),
  check('purity').optional({ checkFalsy: true }).trim(),
  check('description').optional({ checkFalsy: true }).trim(),
];

const validateEnquiry = [
  check('name').notEmpty().withMessage('Name is required').trim(),
  check('phone').notEmpty().withMessage('Phone is required').trim(),
  check('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  check('message')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters long'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((e) => e.msg).join(', ');
    return res.status(400).json({ success: false, message: errorMessages, errors: errors.array() });
  }
  next();
};

module.exports = {
  validateProduct,
  validateEnquiry,
  handleValidationErrors,
};
