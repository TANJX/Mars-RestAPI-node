const mongoose = require('mongoose');

const ColorSettingSchema = new mongoose.Schema({
  user: String,
  type: String,
  name: String,
  color: String,
}, { collection: '_settings_color' });

module.exports = ColorSettingSchema;
