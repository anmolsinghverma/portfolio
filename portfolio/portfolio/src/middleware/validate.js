const { body, validationResult } = require('express-validator');

const noNewlines = (v) => !/[\r\n]/.test(v);

exports.contactRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Enter your name (2–80 characters).'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').isLength({ max: 120 }).normalizeEmail(),
  body('subject').optional({ values: 'falsy' }).trim().isLength({ max: 120 }).withMessage('Subject is limited to 120 characters.')
    .custom(noNewlines).withMessage('Subject must be a single line.'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Write a message of 10–2000 characters.'),
];

exports.handleValidation = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array({ onlyFirstError: true }).map((e) => ({ field: e.path, message: e.msg }));
  res.status(422).json({ success: false, errors });
};
