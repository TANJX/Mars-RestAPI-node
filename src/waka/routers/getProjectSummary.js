import waka from './getDataFromMongo';

/**
 * @param user
 * @param {number} limit - number of days
 */
const parse = async (user, limit = 0) => {
  const data = await waka(user, limit);

  const projects = {};

  for (let i = 0; i < data.length; i++) {
    const field_names = Object.keys(data[i].projects);
    for (let l = 0; l < field_names.length; l++) {
      const name = field_names[l];
      const time = data[i].projects[name];
      if (projects[name]) {
        projects[name] += time;
      } else {
        projects[name] = time;
      }
    }
  }

  return projects;
};

export default parse;
