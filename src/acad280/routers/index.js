import { Router } from 'express';

import param_check from '../../util/param_check';

const { db_acad280 } = require('../../app');

const MouseLocation = db_acad280.model('MouseLocation');

const router = Router();

router.get('/list', async (req, res) => {
  MouseLocation.find(
    {},
    { _id: 0 },
    { sort: { time: 1 } },
  ).then((locations) => {
    if (!locations) locations = [];
    res.json(locations);
  });
});

router.post('/add', async (req, res) => {
  if (!await param_check(req, res, 'time', 'positionX', 'positionY', 'processId', 'applicationName')) return;
  const { time, positionX, positionY, processId, applicationName } = req.body;
  const mouseLocation = new MouseLocation();
  mouseLocation.time = time;
  mouseLocation.positionX = positionX;
  mouseLocation.positionY = positionY;
  mouseLocation.processId = processId;
  mouseLocation.applicationName = applicationName;
  mouseLocation.save().then((saved) => {
    res.json(saved);
  });
});


module.exports = router;
