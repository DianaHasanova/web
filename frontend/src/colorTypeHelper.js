import Color from 'color';

// Массив с правилами цветотипов по вашей таблице
const COLOR_TYPES = [
  {
    name: "Весна",
    hue: [
      { min: 0, max: 60 },
      { min: 300, max: 360 }
    ],
    s: { min: 30, max: 100 },
    v: { min: 40, max: 100 }
  },
  {
    name: "Лето",
    hue: [
      { min: 180, max: 270 }
    ],
    s: { min: 10, max: 70 },
    v: { min: 40, max: 90 }
  },
  {
    name: "Осень",
    hue: [
      { min: 30, max: 90 },
      { min: 210, max: 240 }
    ],
    s: { min: 40, max: 100 },
    v: { min: 30, max: 80 }
  },
  {
    name: "Зима",
    hue: [
      { min: 150, max: 180 },
      { min: 270, max: 330 }
    ],
    s: { min: 60, max: 100 },
    v: { min: 20, max: 100 }
  }
];

// Проверка попадания значения в диапазон
function inRange(value, min, max) {
  return value >= min && value <= max;
}

// Проверка попадания hue в один из диапазонов (т.к. их может быть несколько)
function isHueInRanges(hue, ranges) {
  return ranges.some(range => inRange(hue, range.min, range.max));
}


export function getColorType(hexColor) {
  let color;
  try {
    color = Color(hexColor);
  } catch (e) {
    return '';
  }
  const [h, s, v] = color.hsv().array();

  // Проверяем каждый цветотип
  const types = COLOR_TYPES.filter(type => {
    const hueOk = isHueInRanges(h, type.hue);
    const sOk = inRange(s, type.s.min, type.s.max);
    const vOk = inRange(v, type.v.min, type.v.max);
    return hueOk && sOk && vOk;
  }).map(type => type.name);

  return types.join(' ');
}
