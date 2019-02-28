const moment = require('moment');

function timestamp() {
    return '[' + moment().format() + ']';
}

function c_log(msg) {
    console.log(timestamp() + msg);
}

function c_error(msg) {
    console.error(timestamp() + msg);
}

export {c_log, c_error}
