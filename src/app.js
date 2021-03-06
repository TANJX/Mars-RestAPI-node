import bodyParser from 'body-parser';
import log from './util/log';

const fs = require('fs');
const http = require('http');
const https = require('https');
require('dotenv')
  .config();

const chalk = require('chalk');


// mongoose

const mongoose = require('mongoose');

let db_waka;
let db_apps;
let db_acad280;

if (process.env.NODE_ENV === 'test') {
  db_waka = mongoose.createConnection(process.env.MONGO_URL_TEST, { useNewUrlParser: true });
  db_apps = db_waka;
} else {
  const mongo_url = process.env.MONGO_URL;
  const db_apps_url = process.env.DB_APPS;
  const db_waka_url = process.env.DB_WAKA;
  const db_acad280_url = process.env.DB_ACAD280;
  if (!mongo_url || !db_apps_url || !db_waka_url || !db_acad280_url) {
    log.error('MONGO_URL missing. Did you create a .env file?');
    process.exit(1);
  }
  db_waka = mongoose.createConnection(mongo_url + db_waka_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  db_apps = db_waka.useDb(db_apps_url);
  db_acad280 = db_waka.useDb(db_acad280_url);
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

db_acad280.on('error', (err) => {
  log.error(err);
});
db_acad280.once('open', () => {
  log.log('Connected to MongoDB / ACAD280');
});


// models

db_waka.model('ColorSetting', require('./waka/models/ColorSetting'));
db_waka.model('ProjectName', require('./waka/models/ProjectName'));

db_apps.model('Log', require('./apps/models/Log'));
db_apps.model('Event', require('./apps/models/Event'));
db_apps.model('Progress', require('./apps/models/Progress'));
db_apps.model('User', require('./apps/models/User'));
db_apps.model('Token', require('./apps/models/Token'));

db_acad280.model('MouseLocation', require('./acad280/models/MouseLocation'));
db_acad280.model('ProcessName', require('./acad280/models/ProcessName'));

// express

const express = require('express');

const app = express();
let server;

module.exports = {
  db_apps,
  db_waka,
  db_acad280,
  app,
  close_server: () => {
    server.close();
    process.exit(0);
  },
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
app.use('/acad280', require('./acad280/routers'));
app.use('/droplet', require('./droplet/routers'));

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

const httpServer = http.createServer(app);

server = httpServer.listen(8000, () => {
  log.log('Server running on port 8000');
});


if (process.env.NODE_ENV === 'production') {
  const key = fs.readFileSync('/home/node/app/cert/privkey.pem', 'utf8');
  const cert = fs.readFileSync('/home/node/app/cert/cert.pem', 'utf8');
  const ca = fs.readFileSync('/home/node/app/cert/chain.pem', 'utf8');

  const credentials = {
    key,
    cert,
    ca,
  };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, () => {
    log.log('HTTPS Server running on port 443');
  });
}
