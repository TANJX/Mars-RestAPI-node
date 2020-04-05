import { Router } from 'express';

import variable_valid from '../../util/variable_valid';

const { db_acad280 } = require('../../app');

const MouseLocation = db_acad280.model('MouseLocation');

const router = Router();

router.get('/locations', async (req, res) => {
  MouseLocation.find(
    {},
    { _id: 0 },
    { sort: { time: 1 } },
  ).then((locations) => {
    if (!locations) locations = [];
    res.json(locations);
  });
});

router.post('/locations', async (req, res) => {
  if (!Array.isArray(req.body.locations)) {
    return res.status(422).json({
      errors: {
        message: 'missing/wrong locations field',
      },
    });
  }
  const locations = req.body.locations.filter(
    location => variable_valid(
      location.time,
      location.positionX,
      location.positionY,
      location.processId,
      location.applicationName,
    ),
  );
  await MouseLocation.insertMany(locations);
  res.json({ count: locations.length });
});


module.exports = router;
