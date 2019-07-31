import log from '../../util/log';

const { db_waka } = require('../../app');

const parse = async (user, limit) => {
  try {
    return await new Promise((resolve, reject) => {
      db_waka.db.collection(user, (err, collection) => {
        collection.find({}, {
          projection: { _id: 0 },
          limit,
          sort: { date: -1 },
        }).toArray((err1, d) => (err1 ? reject(err1) : resolve(d)));
      });
    });
  } catch (e) {
    log.error(e);
    return [];
  }
};

export default parse;
