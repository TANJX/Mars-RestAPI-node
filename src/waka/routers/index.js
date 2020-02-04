import { Router } from 'express';
import waka from './getDataFromMongo';
import waka_project_sum from './getProjectSummary';
import waka_project from './getProjectDataForChart';
import waka_pie from './getPieChartDataForChart';
import waka_color from './getColorSetting';
import waka_project_name from './setProjectNameSetting';
import waka_db_cleanup from './dbCleanup';
import param_check from '../../util/param_check';


const router = Router();


router.get('/total/:user', async (req, res) => {
  res.json(await waka(req.params.user, 1));
});

router.get('/total/:user/:limit', async (req, res) => {
  res.json(await waka(req.params.user, parseInt(req.params.limit)));
});


router.get('/project/:user', async (req, res) => {
  res.json(await waka_project_sum(req.params.user, parseInt(req.params.limit)));
});


router.get('/chart/project/:user', async (req, res) => {
  res.json(await waka_project(req.params.user, 0));
});

router.get('/chart/project/:user/:limit', async (req, res) => {
  res.json(await waka_project(req.params.user, parseInt(req.params.limit)));
});

router.get('/chart/project/:user/:limit/:threshold', async (req, res) => {
  res.json(await waka_project(
    req.params.user,
    parseInt(req.params.limit),
    parseInt(req.params.threshold),
  ));
});


router.get('/chart/editor/:user', async (req, res) => {
  res.json(await waka_pie(req.params.user, 'editor', 0));
});

router.get('/chart/editor/:user/:limit', async (req, res) => {
  res.json(await waka_pie(req.params.user, 'editor', parseInt(req.params.limit)));
});


router.get('/chart/language/:user', async (req, res) => {
  res.json(await waka_pie(req.params.user, 'language', 0));
});

router.get('/chart/language/:user/:limit', async (req, res) => {
  res.json(await waka_pie(req.params.user, 'language', parseInt(req.params.limit)));
});


router.get('/settings/color/:user/:type/:name', async (req, res) => {
  const { user, type, name } = req.params;
  res.json(await waka_color(user, type, name));
});

router.post('/settings/projectname/:user/', async (req, res) => {
  if (!await param_check(req, res, 'replace_to', 'name')) return;
  const { user } = req.params;
  const { name, replace_to } = req.body;
  res.json(await waka_project_name(user, name, replace_to));
});

router.get('/settings/cleanup/:user/', async (req, res) => {
  const { user } = req.params;
  res.json(await waka_db_cleanup(user));
});

module.exports = router;
