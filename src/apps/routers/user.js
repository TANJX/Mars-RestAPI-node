import { Router } from 'express';
import { sha256 } from 'js-sha256';

import param_check from '../../util/param_check';

const { db_apps } = require('../../app');

const User = db_apps.model('User');
const Token = db_apps.model('Token');

const router = Router();

router.post('/', async (req, res) => {
  if (!await param_check(req, res, 'name', 'password')) return;
  const { name, password } = req.body;
  const hash = sha256(password);
  const user = await User.findOne({ name, password: hash }).exec();
  if (user) {
    const user_token = Token.generateToken();
    const token = new Token();
    await Token.findOneAndDelete({ user: user.name }).exec();
    token.user = user.name;
    token.token = user_token;
    token.expire = Date.now() + 1000 * 60 * 60 * 24 * 7;
    token.save().then((saved) => {
      res.status(200).json(saved);
    });
  } else {
    res.status(401).json({
      errors: {
        message: 'Cannot find the user',
      },
    });
  }
});


module.exports = router;
