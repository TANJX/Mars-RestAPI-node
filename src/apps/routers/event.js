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
  if (!await param_check(req, res, 'token', 'name', 'date', 'type')) return;
  const { name, type, date } = req.body;
  if (!/\d{4}-[0-1]\d-[0-3]\d/g.test(date)) {
    res.status(422).json({
      errors: {
        message: 'date format is wrong',
      },
    });
    return;
  }
  const event = new Event();
  event.name = name;
  event.date = date;
  event.type = type;
  event.save().then((saved) => {
    res.json(saved);
  });
});


module.exports = router;
