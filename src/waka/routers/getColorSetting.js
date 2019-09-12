const { db_waka } = require('../../app');

const ColorSetting = db_waka.model('ColorSetting');

async function find(user, type, name) {
  const color_setting = await ColorSetting.findOne({ user, type, name }, { _id: 0 }).exec();
  return color_setting ? color_setting : {};
}

export default find;
