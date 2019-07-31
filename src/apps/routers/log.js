import { Router } from 'express';

const { db_apps } = require('../../app');

const Log = db_apps.model('Log');

const router = Router();

router.get('/list', async (req, res) => {
  Log.find({}, { _id: 0 }).then((logs) => {
    if (!logs) logs = [];
    res.json(logs);
  });
});

router.post('/add', async (req, res) => {
  const { msg } = req.body;
  const time = Date.now();
  const log = new Log();
  log.msg = msg;
  log.time = time;
  log.save().then(() => {
    res.json({ msg, time });
  });
});


export default router;
