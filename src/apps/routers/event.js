import { Router } from 'express';

const { db_apps } = require('../../app');

const Event = db_apps.model('Event');

const router = Router();

router.get('/list', async (req, res) => {
  Event.find({}, { _id: 0 }).then((events) => {
    if (!events) events = [];
    res.json(events);
  });
});

router.post('/add', async (req, res) => {
  const { msg, type, time } = req.body;
  const event = new Event();
  event.msg = msg;
  event.time = time;
  event.type = type;
  event.save().then(() => {
    res.json({ msg, time, type });
  });
});


module.exports = router;
