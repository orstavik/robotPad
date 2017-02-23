/**
 * Created by orstavik on 23.02.17.
 */
class StaticColorMaker {
  static staticColors() {
    return [
      [5, 50, 50],
      [35, 50, 50],
      [50, 50, 50],
      [60, 50, 50],
      [90, 50, 49],
      [120, 50, 45],
      [150, 50, 40],
      [180, 50, 35],
      [210, 50, 50],
      [225, 50, 50],
      [310, 50, 40],
      [340, 50, 45]
    ];
  }

  static calculateRGB(hsl, degreeSunset) {
    const rgb = StaticColorMaker.hslToRgb(hsl[0] / 360, hsl[1] / 100, hsl[2] / 100);
    const sunset = StaticColorMaker.transformAsSunset(degreeSunset, rgb);
    return StaticColorMaker.rgbToHsl(sunset.r, sunset.g, sunset.b);
  }

  static transformAsSunset(degreeSunset, rgb) {
    const res = StaticColorMaker.makeSunsetModifier(degreeSunset);
    return {
      r: rgb[0] * (1 + res.r),
      g: rgb[1] * (1 + res.g),
      b: rgb[2] * (1 + res.b)
    };
  }

  static makeSunsetModifier(degreeSunset) {
    const blue = -60;
    const red = 60;
    const green = 39;
    return {
      r: Math.sin(degreeSunset) * red / Math.sin(90 - degreeSunset),
      g: Math.sin(degreeSunset) * green / Math.sin(90 - degreeSunset),
      b: Math.sin(degreeSunset) * blue / Math.sin(90 - degreeSunset)
    };
  }

  static calculateHSL(item, s, l) {
    return [
      item[0],
      item[1] + (s >= 0 ? (100 - item[1]) * s : item[1] * s),
      item[2] + (l >= 0 ? (100 - item[2]) * l : item[2] * l)
    ];
  }

  static _computeHSL(item) {
    return "hsl(" + Math.round(item[0]) + "," + Math.round(item[1]) + "%," + Math.round(item[2]) + "%)";
  }

  /**
   * Converts an RGB color value to HSL. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes r, g, and b are contained in the set [0, 255] and
   * returns h, s, and l in the set [0, 1].
   *
   * @param   Number  r       The red color value
   * @param   Number  g       The green color value
   * @param   Number  b       The blue color value
   * @return  Array           The HSL representation
   */
  static rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }


  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * @param   Number  h       The hue
   * @param   Number  s       The saturation
   * @param   Number  l       The lightness
   * @return  Array           The RGB representation
   */
  static hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
  }
}