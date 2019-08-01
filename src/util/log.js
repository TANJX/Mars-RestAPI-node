const moment = require('moment');

const is_test = process.env.NODE_ENV === 'test';

function timestamp() {
  return `[${moment().format()}]`;
}

const log = {
  log(msg) {
    if (!is_test) {
      console.log(`${timestamp()} ${msg}`);
    }
  },
  error(msg) {
    if (!is_test) {
      console.error(`${timestamp()} ${msg}`);
    }
  },
};

export default log;
