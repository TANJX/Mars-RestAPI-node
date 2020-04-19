const mongoose = require('mongoose');

const MouseLocationSchema = new mongoose.Schema({
  time: { type: [Number], index: true },
  positionX: Number,
  positionY: Number,
  processId: Number, // foreign key to processName
  applicationName: Number, // foreign key to applicationName
}, { collection: 'mouse_location' });


module.exports = MouseLocationSchema;
