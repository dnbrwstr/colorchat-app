let hue2rgb = (p, q, t) => {
  if(t < 0) t += 1;
  if(t > 1) t -= 1;
  if(t < 1/6) return p + (q - p) * 6 * t;
  if(t < 1/2) return q;
  if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}

export let hsl2rgb = (hsl) => {
  var h = hsl.h / 360;
  var s = hsl.s / 100;
  var l = hsl.l / 100;

  var r, g, b;

  if (s == 0) {
      r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  var rgb = {
    r: Math.floor(r * 255),
    g: Math.floor(g * 255),
    b: Math.floor(b * 255)
  };

  return rgb;
};

export let hsl2hex = hsl => rgb2hex(hsl2rgb(hsl));

let toHexPart = (rgb) => {
  let val = rgb.toString(16);
  return val.length == 1 ?
    '0' + val : val;
}

export let rgb2hex = (rgb) => {
  return '#' + [rgb.r, rgb.g, rgb.b].map(toHexPart).join('');
}

