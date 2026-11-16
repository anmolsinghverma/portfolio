const { Schema, model } = require('mongoose');

module.exports = model('Profile', new Schema({
  name: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  bio: { type: String, required: true },
  location: String,
  email: String,
  socials: { github: String, linkedin: String, resume: String },
}, { timestamps: true }));
