import { Router } from 'express';

const { db_apps } = require('../../app');

const Progress = db_apps.model('Progress');

const router = Router();

router.get('/list', async (req, res) => {
  Progress.find({}, { _id: 0 }).then((progresses) => {
    if (!progresses) progresses = [];
    res.json(progresses);
  });
});

router.post('/add', async (req, res) => {
  const { name, start, end } = req.body;
  const log = new Progress();
  log.name = name;
  log.start = start;
  log.end = end;
  log.save().then(() => {
    res.json({ name, start, end });
  });
});


module.exports = router;
