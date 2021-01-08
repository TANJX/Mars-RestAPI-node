import { Router } from 'express';

import variable_valid from '../../util/variable_valid';
import log from '../../util/log';
import param_check from '../../util/param_check';

const fs = require('fs');
require('dotenv')
  .config();
const path = require('path');

const router = Router();

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email)
    .toLowerCase());
}

router.post('/register/', async (req, res) => {
  if (!await param_check(req, res, 'email')) return;
  const { email } = req.body;
  if (!validateEmail(email)) {
    res.status(401)
      .json({
        errors: {
          message: 'illegal email address',
        },
      });
    return;
  }
  await fs.appendFileSync('email.txt', `${email}\n`);
  res.json({ success: true });
});

router.get('/emails/', async (req, res) => {
  const email = await fs.readFileSync('email.txt');
  res.send(email);
});


module.exports = router;
