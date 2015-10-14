import values from './values';

let fonts = [
  // 'Aileron-Light',
  // 'Aileron-Regular',
  // 'ClearSans',
  // 'CMU Sans Serif',
  // 'CothamSans',
  // 'Grammatika',
  // 'SaniTrixieSans',
  // 'Tuffy',
  // 'WorkSans-Light',
  'WorkSans-Regular'
];

let font = fonts[Math.floor(Math.random() * fonts.length)];
// let font = "CMU Sans Serif";
console.log('====================');
console.log('FONT', font);

let textBase = {
  fontFamily: font,
  fontSize: 16,
  color: values.midGray
};

let grayBottomBorder = {
  borderBottomWidth: values.borderWidth,
  borderBottomColor: values.midGray
};

let inputBase = {
  ...textBase,
  height: 44,
  paddingTop: 10,
};

let outerWrapperBase = {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  backgroundColor: '#EFEFEF'
};

let contentWrapperBase = {
  flex: 1,
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  padding: values.outerPadding
};

let mixins = {
  textBase,
  grayBottomBorder,
  inputBase,
  outerWrapperBase,
  contentWrapperBase
};

module.exports = mixins;
