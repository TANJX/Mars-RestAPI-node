import { c_log } from './util/log';
import waka_router from './waka/router';
import apps_router from './apps/router';

const chalk = require('chalk');
const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use((req, res, next) => {
  c_log(chalk.black.bgGreen(` ${req.method}`, chalk.reset.bold(` ${req.path}`)));
  next();
});

app.use('/waka', waka_router);
app.use('/apps', apps_router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err.message === 'Not Found') {
    c_log(chalk.black.bgRed(' ERROR', chalk.reset.bold(` ${err.message}`)));
  } else {
    c_log(err.stack);
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

app.listen(3000, () => {
  c_log('Server running on port 3000');
});
