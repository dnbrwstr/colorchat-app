import { Platform } from "react-native";
import values from "./values";

let textBase = {
  ...Platform.select({
    // ios: { fontFamily: 'Work Sans' },
    // android: { fontFamily: 'WorkSans-Regular' },
  }),
  fontSize: 16,
  color: values.midGray
};

let grayBottomBorder = {
  borderBottomWidth: values.borderWidth,
  borderBottomColor: values.midGray
};

let makeGray = (v, a=1) => {
  const n = v * 255;
  return `rgba(${n}, ${n}, ${n}, ${a})`;
};

let inputBase = {
  ...textBase,
  height: 36,
  lineHeight: 21,
  ...Platform.select({
    ios: {},
    android: {
      textAlignVertical: "center",
      includeFontPadding: false,
      paddingBottom: 7
    }
  })
};

let outerWrapperBase = {
  flex: 1,
  justifyContent: "flex-start",
  alignItems: "stretch"
};

let contentWrapperBase = {
  flex: 1,
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  padding: values.outerPadding
};

let shadowBase = {
  shadowColor: "black",
  shadowOffset: {
    width: 0,
    height: 0
  },
  shadowOpacity: 0.1,
  shadowRadius: 3
};

let mixins = {
  textBase,
  grayBottomBorder,
  inputBase,
  outerWrapperBase,
  contentWrapperBase,
  shadowBase,
  makeGray
};

module.exports = mixins;
