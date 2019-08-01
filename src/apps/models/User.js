const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
});

module.exports = UserSchema;
