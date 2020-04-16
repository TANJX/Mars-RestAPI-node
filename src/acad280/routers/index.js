import { Router } from 'express';

import variable_valid from '../../util/variable_valid';

const { db_acad280 } = require('../../app');

const MouseLocation = db_acad280.model('MouseLocation');
const ProcessName = db_acad280.model('ProcessName');
const ApplicationName = db_acad280.model('ApplicationName');

const router = Router();


/**
 * List all MouseLocation
 *
 * @return Object
 {
 locations: [
  {
    icon: '/img/ai.png',
    name: 'Adobe Illustrator',
    locations: [
      [1580281103.5818355, 603, 1183],
      [1580281103.5818355, 603, 1183],
      [1580281103.5818355, 603, 1183],
      [1580281103.5818355, 603, 1183],
    ]
  },
  {
    icon: '/img/ae.png',
    name: 'Adobe After Effects',
    locations: [
      [1580281103.5818355, 603, 1183],
      [1580281103.5818355, 603, 1183],
      [1580281103.5818355, 603, 1183],
      [1580281103.5818355, 603, 1183],
    ]
  }
 ]
 }
 */
router.get('/locations', async (req, res) => {
  ProcessName.find(
    {},
    { _id: 0 },
    { sort: { id: 1 } },
  ).then((processes) => {
    if (processes) {
      MouseLocation.find(
        {},
        { _id: 0 },
        { sort: { time: 1 } },
      ).then((locations) => {
        const result = [];
        for (const process of processes) {
          const n = process.name.replace('.exe', '');
          const entry = {
            icon: `${n}.png`,
            name: process.fullname || n,
            locations: locations.filter(l => l.processId === process.id).map(l => [l.time, l.positionX, l.positionY]),
          };
          if (entry.locations.length > 20) {
            result.push(entry);
          }
        }
        result.sort((a, b) => b.locations.length - a.locations.length);
        res.json({ locations: result });
      });
    }
  });

});


/**
 * Batch add MouseLocations
 *
 * @param Object
 * { locations: Array}
 * Entries with missing field will be ignored
 *
 * @return Object
 * { count : Number } number of entries processed
 */
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


/**
 * List all ProcessName
 *
 * @return Object
 * Example:
 * {
 *   "explorer.exe": 1
 * }
 */
router.get('/processes', async (req, res) => {
  ProcessName.find(
    {},
    { _id: 0 },
    { sort: { id: 1 } },
  ).then((processes) => {
    const result = {};
    if (processes) {
      for (const process of processes) {
        result[process.name] = process.id;
      }
    }
    res.json(result);
  });
});


/**
 * Batch add ProcessName
 *
 * @param Object
 * Example:
 * {
 *   "processes": {
 *     "explorer.exe": 1
 *   }
 * }
 * Entries with existing name or id will be ignored
 *
 * @return Object
 * { count : Number } number of entries processed
 */
router.post('/processes', async (req, res) => {
  if (!req.body.processes) {
    return res.status(422).json({
      errors: {
        message: 'missing/wrong processes field',
      },
    });
  }
  const existing_processes = await ProcessName.find(
    {},
    { _id: 0 },
    { sort: { id: 1 } },
  ).exec();
  if (!Array.isArray(existing_processes)) {
    return res.status(422).json({
      errors: {
        message: 'server error',
      },
    });
  }
  const existing_id = [];
  const existing_name = [];
  existing_processes.forEach((process) => {
    existing_id.push(process.id);
    existing_name.push(process.name);
  });
  const processes = [];
  Object.keys(req.body.processes).forEach((name) => {
    const id = req.body.processes[name];
    if (typeof id === 'number' && !existing_id.includes(id) && !existing_name.includes(name)) {
      processes.push({ name, id });
    }
  });
  if (processes.length > 0) await ProcessName.insertMany(processes);
  res.json({ count: processes.length });
});


/**
 * List all ApplicationName
 *
 * @return Object
 * Example:
 * {
 *   "Adobe Photoshop 2020": 1
 * }
 */
router.get('/applications', async (req, res) => {
  ApplicationName.find(
    {},
    { _id: 0 },
    { sort: { id: 1 } },
  ).then((applications) => {
    const result = {};
    if (applications) {
      for (const application of applications) {
        result[application.name] = application.id;
      }
    }
    res.json(result);
  });
});


/**
 * Batch add ApplicationName
 *
 * @param Object
 * Example:
 * {
 * "applications": {
 *   "Adobe Photoshop 2020": 1
 *  }
 * }
 * Entry with existing name or id will be ignored
 *
 * @return Object
 * { count : Number } number of entries processed
 */
router.post('/applications', async (req, res) => {
  if (!req.body.applications) {
    return res.status(422).json({
      errors: {
        message: 'missing/wrong applications field',
      },
    });
  }
  const existing_applications = await ApplicationName.find(
    {},
    { _id: 0 },
    { sort: { id: 1 } },
  ).exec();
  if (!Array.isArray(existing_applications)) {
    return res.status(422).json({
      errors: {
        message: 'server error',
      },
    });
  }
  const existing_id = [];
  const existing_name = [];
  existing_applications.forEach((process) => {
    existing_id.push(process.id);
    existing_name.push(process.name);
  });
  const applications = [];
  Object.keys(req.body.applications).forEach((name) => {
    const id = req.body.applications[name];
    if (typeof id === 'number' && !existing_id.includes(id) && !existing_name.includes(name)) {
      applications.push({ name, id });
    }
  });
  if (applications.length > 0) await ProcessName.insertMany(applications);
  res.json({ count: applications.length });
});


module.exports = router;
