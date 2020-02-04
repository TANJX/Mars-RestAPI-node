const mongoose = require('mongoose');

const ProjectNameSettingSchema = new mongoose.Schema({
  user: String,
  name: String,
  replace_to: String,
}, { collection: '_settings_project_name' });

module.exports = ProjectNameSettingSchema;
