const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const portfolio = require('../controllers/portfolio.controller');
const contact = require('../controllers/contact.controller');
const { contactRules, handleValidation } = require('../middleware/validate');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, errors: [{ message: 'Too many messages. Try again in a few minutes.' }] },
});

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.get('/profile', portfolio.getProfile);
router.get('/projects', portfolio.getProjects);
router.get('/skills', portfolio.getSkills);
router.post('/contact', contactLimiter, contactRules, handleValidation, contact.create);

module.exports = router;
