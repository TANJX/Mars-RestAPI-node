import waka from './getDataFromMongo';

const { db_waka } = require('../../app');

const ProjectName = db_waka.model('ProjectName');

async function cleanup(user) {
  const project_name_settings = await ProjectName.find({ user }, { _id: 0 }).exec();
  const project_name_map = {};

  for (const project of project_name_settings) {
    project_name_map[project.name] = project.replace_to;
  }

  let count = 0;
  const waka_data = await waka(user);

  db_waka.db.collection(user, async (err, collection) => {
    for (const day_data of waka_data) {
      let change = false;
      for (const project_name in day_data.projects) {
        if (!day_data.projects.hasOwnProperty(project_name)) {
          continue;
        }
        if (project_name_map[project_name]) {
          const replace_to = project_name_map[project_name];
          if (day_data.projects[replace_to]) {
            day_data.projects[replace_to] += day_data.projects[project_name];
          } else {
            day_data.projects[replace_to] = day_data.projects[project_name];
          }
          delete day_data.projects[project_name];
          change = true;
          ++count;
        }
      }
      if (change) {
        // push to mongo
        await collection.replaceOne({ date: day_data.date }, day_data);
      }
    }
    return { data: waka_data, count };
  });
}

export default cleanup;
