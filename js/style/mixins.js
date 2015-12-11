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
  'Work Sans'
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
  height: 36,
  lineHeight: 1,
  paddingTop: 10,
};

let outerWrapperBase = {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'stretch',
};

let contentWrapperBase = {
  flex: 1,
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  padding: values.outerPadding
};

let shadowBase = {
  shadowColor: 'black',
  shadowOffset: {
    width: 0,
    height: 0
  },
  shadowOpacity: .1,
  shadowRadius: 3
};

let mixins = {
  textBase,
  grayBottomBorder,
  inputBase,
  outerWrapperBase,
  contentWrapperBase,
  shadowBase
};

module.exports = mixins;
