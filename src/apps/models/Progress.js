const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  name: String,
  start: Date,
  end: Date,
});

module.exports = ProgressSchema;
