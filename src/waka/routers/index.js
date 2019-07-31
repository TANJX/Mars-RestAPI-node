import { Router } from 'express';
import waka from './getDataFromMongo';
import waka_project from './getProjectDataForChart';
import waka_pie from './getPieChartDataForChart';
import waka_color from './getColorSetting';


const router = Router();


router.get('/total/:user', async (req, res) => {
  res.json(await waka(req.params.user, 1));
});

router.get('/total/:user/:limit', async (req, res) => {
  res.json(await waka(req.params.user, parseInt(req.params.limit)));
});

router.get('/chart/project/:user', async (req, res) => {
  res.json(await waka_project(req.params.user, 0));
});

router.get('/chart/editor/:user', async (req, res) => {
  res.json(await waka_pie(req.params.user, 'editor', 0));
});

router.get('/chart/language/:user', async (req, res) => {
  res.json(await waka_pie(req.params.user, 'language', 0));
});

router.get('/chart/project/:user/:limit', async (req, res) => {
  res.json(await waka_project(req.params.user, parseInt(req.params.limit)));
});

router.get('/chart/editor/:user/:limit', async (req, res) => {
  res.json(await waka_pie(req.params.user, 'editor', parseInt(req.params.limit)));
});

router.get('/chart/language/:user/:limit', async (req, res) => {
  res.json(await waka_pie(req.params.user, 'language', parseInt(req.params.limit)));
});

router.get('/chart/settings/:user/:type/:name', async (req, res) => {
  const { user, type, name } = req.params;
  res.json(waka_color(user, type, name));
});

module.exports = router;
