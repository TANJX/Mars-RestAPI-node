/**
 * Check if params and token exist,
 * if not, status 422, return false
 */
function check(...params) {
  for (const param of params) {
    if (param === undefined || param === null) return false;
  }
  return true;
}

export default check;
