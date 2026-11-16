const env = require('../config/env');

exports.notFound = (req, res) => res.status(404).json({ success: false, errors: [{ message: 'Not found' }] });

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    errors: [{ message: status === 500 && env.isProd ? 'Something went wrong.' : err.message }],
  });
};

exports.asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
