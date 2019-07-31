const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  time: Date,
  msg: String,
});

module.exports = LogSchema;
