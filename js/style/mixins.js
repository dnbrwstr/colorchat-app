import { Platform } from 'react-native';
import values from './values';

let textBase = {
  fontFamily: 'Work Sans',
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
  ...Platform.select({
    ios: {

    },
    android: {
      textAlignVertical: 'bottom',
      paddingBottom: 6
    }
  })
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
