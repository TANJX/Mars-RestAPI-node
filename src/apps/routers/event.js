import { Router } from 'express';

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
