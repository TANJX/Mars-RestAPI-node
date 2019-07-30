import { getCollection, closeClient } from '../mongoClient';
import { c_error } from '../util/log';

const insert = async (user, type, name, color) => {
  const collection = await getCollection('_settings_color');
  if (collection == null) {
    return;
  }
  await collection.insertOne({
    user,
    type,
    name,
    color,
  }, (e) => {
    if (e) {
      c_error('Error: Get data from MongoDB failed');
      c_error(`\tReason: ${e.message}`);
    }
  });
  closeClient();
};

export default insert;
