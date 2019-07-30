import 'dotenv/config';
import { c_error } from './util/log';

const { MongoClient } = require('mongodb');

// Connection URL
const url = process.env.MONGO_HOST;

// Database Name
const dbName = process.env.MONGO_DB;
let client;

const getCollection = async (collectionName) => {
  let error = false;
  client = await MongoClient.connect(url, { useNewUrlParser: true })
    .catch((e) => {
      c_error('Error: Cannot connect to mongodb');
      c_error(`\tReason: ${e.message}`);
      error = true;
    });
  if (error) return null;
  const db = client.db(dbName);
  return db.collection(collectionName);
};

const closeClient = () => {
  client.close();
};

export { getCollection, closeClient };
