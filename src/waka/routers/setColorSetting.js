const { db_waka } = require('../../app');

const ColorSetting = db_waka.model('ColorSetting');

async function set(user, type, name, color) {
  const cs = new ColorSetting();
  cs.user = user;
  cs.type = type;
  cs.name = name;
  cs.color = color;
  await cs.save();
}

export default set;
