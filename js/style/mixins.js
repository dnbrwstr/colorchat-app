import { Platform } from "react-native";
import values from "./values";

let textBase = {
  fontSize: 16
};

let grayBottomBorder = {
  borderBottomWidth: values.borderWidth,
  borderBottomColor: values.midGray
};

let makeGray = (v, a = 1) => {
  const n = Math.round(v * 255);
  return `rgba(${n}, ${n}, ${n}, ${a})`;
};

let inputBase = {
  ...textBase,
  lineHeight: 21,
  paddingLeft: 0,
  ...Platform.select({
    ios: {}
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
