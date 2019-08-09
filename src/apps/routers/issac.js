import { Router } from 'express';

const request = require('request');

const router = Router();

router.get('/', async (req, res) => {
  const url = 'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=250900&key=D8DB5E8DD1E3B56147922516B7FAEC98&steamid=76561198166372435';
  request(url, (err, response, body) => {
    if (!err && response.statusCode < 400) {
      res.send(body);
    }
  });
});

module.exports = router;
