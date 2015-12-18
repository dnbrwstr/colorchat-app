import Color from 'color';
import { PixelRatio } from 'react-native';

let darkGray = '#333';

let darkGrayHighlight = Color(darkGray)
  .lighten(0.1).hexString();

let values = {
  smallFontSize: 12,
  borderWidth: 1 / PixelRatio.get(),
  basePadding: 10,
  horizontalPadding: 18,
  midGray: '#878787',
  almostBlack: '#111',
  darkGray,
  darkGrayHighlight,
  midLightGray: '#DFDFDF',
  lightGray: '#EFEFEF',
  fairlyLightGray: '#F8F8F8',
  veryLightGray: '#FAFAFA',
  outerPadding: 20,
  rowHeight: 80,
  buttonHeight: 60
};

values.backgroundGray = values.lightGray;

module.exports = values;
