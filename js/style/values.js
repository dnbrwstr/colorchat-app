import Color from "color";
import { PixelRatio } from "react-native";

let darkGray = "#333";

let darkGrayHighlight = Color(darkGray)
  .lighten(0.1)
  .hexString();

let values = {
  smallFontSize: 12,
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
  outerPadding: 10,
  rowHeight: 64,
  buttonHeight: 60,
  avatarSize: 40
};

values.backgroundGray = "black";

module.exports = values;
