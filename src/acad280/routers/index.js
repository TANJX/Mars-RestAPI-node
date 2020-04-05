import { Router } from 'express';

import variable_valid from '../../util/variable_valid';

const { db_acad280 } = require('../../app');

const MouseLocation = db_acad280.model('MouseLocation');
const ProcessName = db_acad280.model('ProcessName');
const ApplicationName = db_acad280.model('ApplicationName');

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


router.get('/processes', async (req, res) => {
  ProcessName.find(
    {},
    { _id: 0 },
    { sort: { id: 1 } },
  ).then((processes) => {
    if (!processes) processes = [];
    res.json(processes);
  });
});

router.post('/processes', async (req, res) => {
  if (!Array.isArray(req.body.processes)) {
    return res.status(422).json({
      errors: {
        message: 'missing/wrong processes field',
      },
    });
  }
  // TODO check id exists
  const processes = req.body.processes.filter(
    process => variable_valid(
      process.id,
      process.name,
    ),
  );
  await ProcessName.insertMany(processes);
  res.json({ count: processes.length });
});

router.get('/applications', async (req, res) => {
  ApplicationName.find(
    {},
    { _id: 0 },
    { sort: { id: 1 } },
  ).then((applications) => {
    if (!applications) applications = [];
    res.json(applications);
  });
});

router.post('/applications', async (req, res) => {
  if (!Array.isArray(req.body.applicationes)) {
    return res.status(422).json({
      errors: {
        message: 'missing/wrong applications field',
      },
    });
  }
  // TODO check id exists
  const applications = req.body.applicationes.filter(
    application => variable_valid(
      application.id,
      application.name,
    ),
  );
  await ApplicationName.insertMany(applications);
  res.json({ count: applications.length });
});


module.exports = router;
