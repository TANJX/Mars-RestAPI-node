import { Router } from 'express';

const puppeteer = require('puppeteer');
const fs = require('fs');

import variable_valid from '../../util/variable_valid';
import log from "../../util/log";

const { db_acad280 } = require('../../app');

const MouseLocation = db_acad280.model('MouseLocation');
const ProcessName = db_acad280.model('ProcessName');

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
      log.log('1');
      MouseLocation.find(
        {
          time: { $gt: mouse_location_cache_time },
        },
        { _id: 0 },
        { sort: { time: 1 } },
      ).then((locations) => {
        log.log(locations.length);
        log.log(2);
        if (locations.length > 0) {
          mouse_location_cache_time = locations[locations.length - 1].time[0];
          let lt = -1;
          if (mouse_location_cache.length > 0) {
            lt = mouse_location_cache[mouse_location_cache.length - 1].time[0];
            for (const location of locations) {
              if (location.time > lt) {
                mouse_location_cache.push(location);
              }
            }
          } else {
            mouse_location_cache = locations;
          }
        }
        log.log('3');
        log.log(mouse_location_cache.length);
        const result = [];
        for (const process of processes) {
          const n = process.name.replace('.exe', '');
          const entry = {
            icon: `${n}.png`,
            name: process.fullname || n,
            locations: mouse_location_cache.filter(l => l.processId === process.id).map(l => [l.time, l.positionX, l.positionY]),
            width: process.width || 2560,
            height: process.height || 1400,
          };
          if (entry.locations.length > 500) {
            result.push(entry);
          }
        }
        log.log('4');
        result.sort((a, b) => b.locations.length - a.locations.length);
        log.log('5');
        res.json({ locations: result });
      });
    }
  });
});

let mouse_location_cache = [];
let mouse_location_cache_time = -1;


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
 * Update thumbnail
 */
router.post('/update_thumbnail', async (req, res) => {
  if (!req.body.apps) {
    return res.status(422).json({
      errors: {
        message: 'missing/wrong processes field',
      },
    });
  }
  const path = `${__dirname}/thumbnail`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  const apps = req.body.apps.slice(0);
  const files = {};
  const toBeDeleted = [];
  fs.readdirSync(path).forEach(f => {
    // for each existing thumbnail file
    const n = f.replace('.png', '').split('-');
    // still valid for 1 hour
    if (apps.includes(n[0])) {
      if (parseInt(n[1]) + 1000 * 60 * 60 > Date.now()) {
        for (let i = 0; i < apps.length; i++) {
          if (apps[i] === n[0]) {
            apps.splice(i, 1);
            break;
          }
        }
      } else {
        toBeDeleted.push(f);
      }
    }
    files[n[0]] = n[1];
  });
  if (apps.length > 0) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: 960,
      height: 525,
      deviceScaleFactor: 1,
    });
    await page.goto('http://demo.marstanjx.com/acad280/puppeteer.html', {
      waitUntil: 'networkidle0',
    });
    for (const app of apps) {
      console.log(`generating for ${app}`);
      await page.evaluate(`switchApp('${app}')`);
      await page.waitFor(1000);
      await page.screenshot({ path: `${path}/${app}-${Date.now()}.png` });
    }
    await browser.close();
    toBeDeleted.forEach(f => fs.unlink(`${path}/${f}`, (err) => {
      if (err) throw err;
    }));
  }
  res.json({ success: true });
});

router.get('/thumbnail/:app', async (req, res) => {
  const app = req.params.app;
  const path = `${__dirname}/thumbnail`;
  fs.readdirSync(path).forEach(f => {
    // for each existing thumbnail file
    const n = f.replace('.png', '').split('-');
    // still valid for 1 hour
    if (app === n[0]) {
      res.sendFile(`${path}/${f}`);
    }
  });
});


module.exports = router;
