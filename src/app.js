import waka from './waka/getDataFromMongo'
import waka_project from './waka/getProjectDataForChart'
import waka_color from './waka/getColorSettings'

let express = require("express");
let app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

app.get("/waka/chart/settings/:user/:type/:name", async (req, res) => {
    res.json(await waka_color(req.params['user'], req.params['type'], req.params['name']));
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
