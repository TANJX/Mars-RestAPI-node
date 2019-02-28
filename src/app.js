import waka from './waka/getDataFromMongo'

let express = require("express");
let app = express();

app.get("/waka/:user", async (req, res) => {
    res.json(await waka(req.params['user'], 1));
});

app.get("/waka/:user/:limit", async (req, res) => {
    res.json(await waka(req.params['user'], parseInt(req.params['limit'])));
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
