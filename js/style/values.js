import Color from 'color';
import { PixelRatio } from 'react-native';

let darkGray = '#333';

let darkGrayHighlight = Color(darkGray)
  .lighten(0.1).hexString();

let values = {
  borderWidth: 1 / PixelRatio.get(),
  basePadding: 10,
  horizontalPadding: 14,
  midGray: '#878787',
  darkGray,
  darkGrayHighlight,
  midLightGray: '#DFDFDF',
  lightGray: '#EFEFEF',
  veryLightGray: '#FAFAFA',
  outerPadding: 20,
  rowHeight: 80
};

module.exports = values;
