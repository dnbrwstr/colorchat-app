import values from './values';

const textBase = {
  fontSize: 16,
  lineHeight: 22,
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
} as const;

const outerWrapperBase = {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'stretch',
} as const;

const contentWrapperBase = {
  flex: 1,
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  padding: values.outerPadding,
} as const;

const shadowBase = {
  shadowColor: 'black',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.1,
  shadowRadius: 3,
} as const;

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
