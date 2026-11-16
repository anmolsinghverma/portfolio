const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter;
const enabled = Boolean(env.smtp.host && env.ownerEmail);

if (enabled) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
} else {
  console.warn('Email disabled: set SMTP_HOST and OWNER_EMAIL to enable notifications.');
}

// Plain-text only, so user input is never interpreted as HTML.
exports.sendContactNotification = async (msg) => {
  if (!enabled) return false;
  await transporter.sendMail({
    from: env.mailFrom || env.smtp.user,
    to: env.ownerEmail,
    replyTo: msg.email,
    subject: `Portfolio contact: ${msg.subject || 'New message'}`,
    text: `From: ${msg.name} <${msg.email}>\n\n${msg.message}`,
  });
  return true;
};
