const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: String,
  date: String,
  type: String,
});

module.exports = EventSchema;
