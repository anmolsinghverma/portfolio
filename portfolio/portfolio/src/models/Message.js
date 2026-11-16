const { Schema, model } = require('mongoose');

module.exports = model('Message', new Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
  subject: { type: String, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  ip: String,
  emailSent: { type: Boolean, default: false },
}, { timestamps: true }));
