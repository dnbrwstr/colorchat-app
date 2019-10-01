import {StyleSheet} from 'react-native';
import Color from 'color';
import values from './values';
import themes from './themes';
import mixins from './mixins';

const makeStyles = function(styles) {
  for (let key in styles) {
    makeStyle(styles[key]);
  }

  return styles;
};

const makeStyle = function(style) {
  if (style.mixins && style.mixins instanceof Array) {
    style.mixins.forEach(mixin => {
      mixin = makeStyle(mixin);

      for (let prop in mixin) {
        if (typeof style[prop] === 'undefined') {
          style[prop] = mixin[prop];
        }
      }
    });

    delete style.mixins;
  }

  return style;
};

const lighten = (hexString: string, amount: number) =>
  Color(hexString)
    .lighten(amount)
    .hex();

const darken = (hexString: string, amount: number) =>
  Color(hexString)
    .darken(amount)
    .hex();

const createStylesheet = style => StyleSheet.create(makeStyles(style));

let Style = {
  create: createStylesheet,
  mixins,
  util: {
    lighten,
    darken,
  },
  values,
  themes,
};

export default Style;
