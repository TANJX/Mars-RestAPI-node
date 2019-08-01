/*
 * Check if params exist,
 * if not, status 422, return false
 */
function check(req, res, ...params) {
  for (const param of params) {
    if (!req.body[param]) {
      res.status(422).json({
        errors: {
          message: `no ${param} field`,
        },
      });
      return false;
    }
  }
  return true;
}

export default check;
