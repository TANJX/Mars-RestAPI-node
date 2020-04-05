

const { db_apps } = require('../app');

const Token = db_apps.model('Token');

/**
 * Check if params and token exist,
 * if not, status 422, return false
 */
async function check(req, res, ...params) {
  for (const param of params) {
    if (!req.body[param]) {
      res.status(422).json({
        errors: {
          message: `no ${param} field`,
        },
      });
      return false;
    }
    if (param === 'token') {
      const token = await Token.findOne({ token: req.body.token }).exec();
      if (!token || new Date(token.expire).getTime() < Date.now()) {
        res.status(401).json({
          errors: {
            message: 'no permission',
          },
        });
        return false;
      }
    }
  }
  return true;
}
export default check;
