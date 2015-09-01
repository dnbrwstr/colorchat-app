import values from './values';

let textBase = {
  fontFamily: 'Source Code Pro',
  fontSize: 18,
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
