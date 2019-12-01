import {StyleSheet} from 'react-native';
import Color from 'color';
import values from './values';
import themes from './themes';
import mixins from './mixins';

const lighten = (hexString: string, amount: number) =>
  Color(hexString)
    .lighten(amount)
    .hex();

const darken = (hexString: string, amount: number) =>
  Color(hexString)
    .darken(amount)
    .hex();

const Style = {
  mixins,
  util: {
    lighten,
    darken,
  },
  values,
  themes,
};

export default Style;
