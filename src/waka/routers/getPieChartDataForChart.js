import waka from './getDataFromMongo';
import getColor from './getColorSetting';
import setColor from './setColorSetting';
import getRandomRGB from '../../util/getRandomRGBHex';

const parse = async (user, field, limit) => {
  const data = await waka(user, limit);

  // in second
  const threshold = 120;

  // max amount of editors
  const max = 12;

  const field_data = [];

  const field_plural = `${field}s`;

  for (let i = 0; i < data.length; i++) {
    const field_names = Object.keys(data[i][field_plural]);
    for (let l = 0; l < field_names.length; l++) {
      const name = field_names[l];
      const time = data[i][field_plural][name];
      const found = field_data.find(n => n.name === name);
      if (found == null) {
        field_data.push({ name, time });
      } else {
        found.time += time;
      }
    }
  }

  field_data.sort((s1, s2) => s2.time - s1.time);

  const field_name = [];
  const field_time = [];
  const field_color = [];
  for (let l = 0; l < field_data.length; l++) {
    if (l >= max) {
      break;
    }
    if (field_data[l].time < threshold) { continue; }
    field_name.push(field_data[l].name);
    field_time.push(field_data[l].time);
    const color_obj = await getColor(user, field, field_data[l].name);
    let hex;
    if (color_obj.color) {
      hex = color_obj.color;
    } else {
      hex = getRandomRGB();
      await setColor(user, field, field_data[l].name, hex);
    }
    field_color.push(hex);
  }

  return {
    labels: field_name,
    datasets: [{
      data: field_time,
      backgroundColor: field_color,
    }],
  };
};

export default parse;
