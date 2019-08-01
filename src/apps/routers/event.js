import { Router } from 'express';

import param_check from '../../util/param_check';

const { db_apps } = require('../../app');

const Event = db_apps.model('Event');

const router = Router();

router.get('/list', async (req, res) => {
  Event.find(
    {},
    { _id: 0 },
    { sort: { time: 1 } },
  ).then((events) => {
    if (!events) events = [];
    res.json(events);
  });
});

router.post('/add', async (req, res) => {
  if (!param_check(req, res, 'name', 'time', 'type')) return;
  const { name, type, time } = req.body;
  const event = new Event();
  event.name = name;
  event.time = time;
  event.type = type;
  event.save().then((saved) => {
    res.json(saved);
  });
});


module.exports = router;
