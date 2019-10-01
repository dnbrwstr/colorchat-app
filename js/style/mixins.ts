import values from './values';

const textBase = {
  fontSize: 16,
};

const grayBottomBorder = {
  borderBottomWidth: values.borderWidth,
  borderBottomColor: values.midGray,
};

const makeGray = (v: number, a = 1) => {
  const n = Math.round(v * 255);
  return `rgba(${n}, ${n}, ${n}, ${a})`;
};

const inputBase = {
  ...textBase,
  paddingLeft: values.outerPadding,
  paddingTop: 10,
  paddingBottom: 10,
};

const outerWrapperBase = {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'stretch',
};

const contentWrapperBase = {
  flex: 1,
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  padding: values.outerPadding,
};

const shadowBase = {
  shadowColor: 'black',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.1,
  shadowRadius: 3,
};

const mixins = {
  textBase,
  grayBottomBorder,
  inputBase,
  outerWrapperBase,
  contentWrapperBase,
  shadowBase,
  makeGray,
};

export default mixins;
