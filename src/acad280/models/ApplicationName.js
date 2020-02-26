const mongoose = require('mongoose');

const ApplicationNameSchema = new mongoose.Schema({
  id: Number,
  name: String,
}, { collection: 'application_name' });

module.exports = ApplicationNameSchema;
