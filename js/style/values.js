import Color from 'color';

let darkGray = '#333';

let darkGrayHighlight = Color(darkGray)
  .lighten(0.1).hexString();

let values = {
  borderWidth: 1,
  basePadding: 10,
  horizontalPadding: 14,
  midGray: '#878787',
  darkGray,
  darkGrayHighlight,
  outerPadding: 24,
  rowHeight: 72
};

module.exports = values;
