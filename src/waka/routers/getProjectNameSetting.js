const { db_waka } = require('../../app');

const ProjectName = db_waka.model('ProjectName');

async function find(user, name) {
  const project_name_setting = await ProjectName.findOne({ user, name }, { _id: 0 }).exec();
  return project_name_setting || {};
}

export default find;
