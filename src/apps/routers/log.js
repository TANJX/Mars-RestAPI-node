import { Router } from 'express';
import param_check from '../../util/param_check';

const { db_apps } = require('../../app');

const Log = db_apps.model('Log');

const router = Router();

router.get('/list', async (req, res) => {
  Log.find(
    {},
    { _id: 0 },
    { sort: { time: -1 } },
  )
    .then((logs) => {
      if (!logs) logs = [];
      res.json(logs);
    });
});

router.post('/add', async (req, res) => {
  if (!await param_check(req, res, 'msg', 'token')) return;
  const { msg } = req.body;
  const time = Date.now();
  const log = new Log();
  log.msg = msg;
  log.time = time;
  log.save().then((saved) => {
    res.json(saved);
  });
});

module.exports = router;
