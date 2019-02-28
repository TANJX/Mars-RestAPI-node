import waka from './waka/getDataFromMongo'

let express = require("express");
let app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/waka/:user", async (req, res) => {
    res.json(await waka(req.params['user'], 1));
});

app.get("/waka/:user/:limit", async (req, res) => {
    res.json(await waka(req.params['user'], parseInt(req.params['limit'])));
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
