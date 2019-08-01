import bodyParser from 'body-parser';
import log from './util/log';

require('dotenv').config();

const chalk = require('chalk');


// mongoose

const mongoose = require('mongoose');

let db_waka;
let db_apps;

if (process.env.NODE_ENV === 'test') {
  db_waka = mongoose.createConnection(process.env.MONGO_URL_TEST, { useNewUrlParser: true });
  db_apps = db_waka;
} else {
  const mongo_url = process.env.MONGO_URL;
  const db_apps_url = process.env.DB_APPS;
  const db_waka_url = process.env.DB_WAKA;
  if (!mongo_url || !db_apps_url || !db_waka_url) {
    log.error('MONGO_URL missing. Did you create a .env file?');
    process.exit(1);
  }
  db_waka = mongoose.createConnection(mongo_url + db_waka_url, { useNewUrlParser: true });
  db_apps = db_waka.useDb(db_apps_url);
}


db_waka.on('error', (err) => {
  log.error(err);
});
db_waka.once('open', () => {
  log.log('Connected to MongoDB / WAKA');
});

db_apps.on('error', (err) => {
  log.error(err);
});
db_apps.once('open', () => {
  log.log('Connected to MongoDB / APPS');
});


// models

db_waka.model('ColorSetting', require('./waka/models/ColorSetting'));
db_apps.model('Log', require('./apps/models/Log'));
db_apps.model('Event', require('./apps/models/Event'));
db_apps.model('Progress', require('./apps/models/Progress'));


// express

const express = require('express');

const app = express();
let server;

module.exports = {
  db_apps, db_waka, app, close_server: () => server.close(),
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use((req, res, next) => {
  log.log(chalk.black.bgGreen(` ${req.method}`, chalk.reset.bold(` ${req.path}`)));
  next();
});

// routers

app.use('/waka', require('./waka/routers'));
app.use('/apps', require('./apps/routers'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err.message === 'Not Found') {
    log.log(chalk.black.bgRed(' ERROR', chalk.reset.bold(` ${err.message}`)));
  } else {
    log.log(err.stack);
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: err,
    },
  });
});

server = app.listen(3000, () => {
  log.log('Server running on port 3000');
});
