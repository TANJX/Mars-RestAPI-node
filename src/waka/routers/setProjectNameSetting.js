const { db_waka } = require('../../app');

const ProjectName = db_waka.model('ProjectName');

async function set(user, name, replace_to) {
  await ProjectName.update(
    { user, name },
    { user, name, replace_to },
    { upsert: true },
  );
}

export default set;
