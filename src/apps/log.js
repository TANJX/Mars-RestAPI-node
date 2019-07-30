import { Router } from 'express';
import { closeClient, getCollection } from '../mongoClient';
import { c_error } from '../util/log';

const router = Router();

router.get('/list', async (req, res) => {
  const collection = await getCollection('log');
  if (collection == null) {
    res.status(500).json({ error: 'Cannot connect to database' });
    return;
  }
  try {
    const result = await new Promise((resolve, reject) => {
      collection.find({}, {
        projection: { _id: 0 },
      }).toArray((err, d) => (err ? reject(err) : resolve(d)));
    });
    res.json(result);
  } catch (e) {
    c_error(e);
    res.status(500).json({ error: 'Query failed!' });
  } finally {
    closeClient();
  }
});

router.post('/add', async (req, res) => {
  const { msg } = req.body;
  const time = Date.now();
  const collection = await getCollection('log');
  if (collection == null) {
    res.status(500).json({ error: 'Cannot connect to database' });
    return;
  }
  await collection.insertOne({ msg, time }, (e) => {
    if (e) {
      c_error('Error: Get data from MongoDB failed');
      c_error(`\tReason: ${e.message}`);
      res.status(500).json({ error: 'Insert failed!' });
    }
  });
  closeClient();
  res.json({ msg, time });
});

export default router;
