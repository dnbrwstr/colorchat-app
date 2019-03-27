import Color from "color";
import { PixelRatio, Dimensions } from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";

const { width: wWidth, height: wHeight } = Dimensions.get("window");
const aspect = wWidth / wHeight;

console.log(wWidth);

let darkGray = "#333";

let darkGrayHighlight = Color(darkGray)
  .lighten(0.1)
  .hexString();

const rowHeight = 64;

let values = {
  smallFontSize: 14,
  largeFontSize: 22,
  borderWidth: 1 / PixelRatio.get(),
  basePadding: 10,
  horizontalPadding: 12,
  midGray: "#878787",
  almostBlack: "#222",
  darkGray,
  darkGrayHighlight,
  midLightGray: "#DFDFDF",
  lightGray: "#EFEFEF",
  fairlyLightGray: "#F8F8F8",
  veryLightGray: "#FAFAFA",
  outerPadding: 15,
  rowHeight,
  buttonHeight: wWidth < 400 ? 54 : 64,
  avatarSize: 40,
  composeBarHeight: rowHeight + (isIphoneX() ? 20 : 0)
};

values.backgroundGray = "black";

module.exports = values;
