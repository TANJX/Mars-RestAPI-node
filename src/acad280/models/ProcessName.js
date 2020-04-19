const mongoose = require('mongoose');

const ProcessNameSchema = new mongoose.Schema({
  id: Number,
  name: String,
  fullname: String,
  width: Number,
  height: Number,
}, { collection: 'process_name' });

module.exports = ProcessNameSchema;
