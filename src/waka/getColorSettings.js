import { getCollection, closeClient } from '../mongoClient';
import { c_error } from '../util/log';


const find = async (user, type, name) => {
  const collection = await getCollection('_settings_color');
  if (collection == null) {
    return null;
  }
  return collection.findOne({ type, name }, {
    projection: { _id: 0 },
  });
};

const parse = async (user, type, name) => {
  let result = {};
  await find(user, type, name).then((d) => {
    result = d;
    closeClient();
  }).catch((e) => {
    c_error('Error: Get data from MongoDB failed');
    c_error(`\tReason: ${e.message}`);
  });
  return result;
};

export default parse;
