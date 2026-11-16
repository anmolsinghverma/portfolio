const { Schema, model } = require('mongoose');

module.exports = model('Skill', new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  level: { type: Number, min: 1, max: 5, default: 3 },
}));
