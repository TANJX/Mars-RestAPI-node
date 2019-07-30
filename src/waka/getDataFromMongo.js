import { closeClient, getCollection } from '../mongoClient';
import { c_error } from '../util/log';

const parse = async (user, limit) => {
  const collection = await getCollection(user);
  if (collection == null) {
    return null;
  }
  const p = () => new Promise((resolve, reject) => {
    collection.find({}, {
      projection: { _id: 0 },
      limit,
      sort: { date: -1 },
    }).toArray((err, d) => (err ? reject(err) : resolve(d)));
  });
  try {
    return await p();
  } catch (e) {
    c_error(e);
    return [];
  } finally {
    closeClient();
  }
};

export default parse;
