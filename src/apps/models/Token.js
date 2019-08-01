const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  user: String,
  token: String,
  expire: Date,
});

TokenSchema.statics.generateToken = function () {
  return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
};

module.exports = TokenSchema;
