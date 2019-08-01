const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: String,
  time: Date,
  type: String,
});

module.exports = EventSchema;
