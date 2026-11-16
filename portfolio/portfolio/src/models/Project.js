const { Schema, model } = require('mongoose');

module.exports = model('Project', new Schema({
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true },
  stack: [String],
  repoUrl: String,
  liveUrl: String,
  year: Number,
  order: { type: Number, default: 0, index: true },
}, { timestamps: true }));
