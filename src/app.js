import waka from './waka/getDataFromMongo'
import waka_project from './waka/getProjectDataForChart'
import waka_pie from './waka/getPieChartDataForChart'
import waka_color from './waka/getColorSettings'
import { c_log } from "./util/log";

const chalk = require('chalk');
const express = require("express");
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((req, res, next) => {
  c_log(chalk.black.bgGreen(` ${req.method}`, chalk.reset.bold(` ${req.path}`)));
  next();
});

app.get("/waka/total/:user", async (req, res) => {
  res.json(await waka(req.params['user'], 1));
});

app.get("/waka/total/:user/:limit", async (req, res) => {
  res.json(await waka(req.params['user'], parseInt(req.params['limit'])));
});

app.get("/waka/chart/project/:user", async (req, res) => {
  res.json(await waka_project(req.params['user'], 0));
});

app.get("/waka/chart/editor/:user", async (req, res) => {
  res.json(await waka_pie(req.params['user'], 'editor', 0));
});

app.get("/waka/chart/language/:user", async (req, res) => {
  res.json(await waka_pie(req.params['user'], 'language', 0));
});

app.get("/waka/chart/project/:user/:limit", async (req, res) => {
  res.json(await waka_project(req.params['user'], parseInt(req.params['limit'])));
});

app.get("/waka/chart/editor/:user/:limit", async (req, res) => {
  res.json(await waka_pie(req.params['user'], 'editor', parseInt(req.params['limit'])));
});

app.get("/waka/chart/language/:user/:limit", async (req, res) => {
  res.json(await waka_pie(req.params['user'], 'language', parseInt(req.params['limit'])));
});

app.get("/waka/chart/settings/:user/:type/:name", async (req, res) => {
  res.json(await waka_color(req.params['user'], req.params['type'], req.params['name']));
});


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
  c_log("Server running on port 3000");
});
