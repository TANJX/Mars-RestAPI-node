import { Router } from 'express';
import param_check from '../../util/param_check';

const { db_apps } = require('../../app');

const Progress = db_apps.model('Progress');

const router = Router();

router.get('/list', async (req, res) => {
  Progress.find(
    {},
    { _id: 0 },
    { sort: { start: 1 } },
  ).then((progresses) => {
    if (!progresses) progresses = [];
    res.json(progresses);
  });
});

router.post('/add', async (req, res) => {
  if (!await param_check(req, res, 'name', 'start', 'end', 'token')) return;
  const { name, start, end } = req.body;
  const log = new Progress();
  log.name = name;
  log.start = start;
  log.end = end;
  log.save().then((saved) => {
    res.json(saved);
  });
});


module.exports = router;
