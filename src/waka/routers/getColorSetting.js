const { db_waka } = require('../../app');

const ColorSetting = db_waka.model('ColorSetting');

function find(user, type, name) {
  ColorSetting.findOne({ user, type, name }, { _id: 0 })
    .then((color_setting) => {
      if (!color_setting) color_setting = {};
      return color_setting;
    });
}

export default find;
