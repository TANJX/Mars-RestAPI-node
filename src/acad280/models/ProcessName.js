const mongoose = require('mongoose');

const ProcessNameSchema = new mongoose.Schema({
  id: Number,
  name: String,
}, { collection: 'process_name' });

module.exports = ProcessNameSchema;
