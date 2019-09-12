const { db_waka } = require('../../app');

const ColorSetting = db_waka.model('ColorSetting');

async function set(user, type, name, color) {
  if (type === 'editor' || type === 'language') {
    user = '_global';
  }
  await ColorSetting.update(
    { user, type, name },
    { user, type, name, color },
    { upsert: true },
  );
}

export default set;
