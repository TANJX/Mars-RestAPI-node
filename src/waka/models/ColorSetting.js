const mongoose = require('mongoose');

const ColorSettingSchema = new mongoose.Schema({
  user: String,
  type: String,
  name: String,
  color: String,
});

module.exports = ColorSettingSchema;
