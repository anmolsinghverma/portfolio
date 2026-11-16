const Message = require('../models/Message');
const mail = require('../services/mail.service');
const { asyncHandler } = require('../middleware/error');

exports.create = asyncHandler(async (req, res) => {
  // Honeypot: real users never fill the hidden "website" field.
  if (req.body.website) return res.status(201).json({ success: true });

  const { name, email, subject, message } = req.body;
  const doc = await Message.create({ name, email, subject, message, ip: req.ip });

  // Email is best-effort: the message is already stored, so a mail failure never fails the request.
  mail.sendContactNotification(doc)
    .then((sent) => sent && Message.updateOne({ _id: doc._id }, { emailSent: true }))
    .catch((err) => console.error('Mail error:', err.message));

  res.status(201).json({ success: true, message: 'Message received.' });
});
