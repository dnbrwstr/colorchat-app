import { StyleSheet } from "react-native";
import Color from "color";

let makeStyles = function(styles) {
  for (let key in styles) {
    makeStyle(styles[key]);
  }

  return styles;
};

let makeStyle = function(style) {
  if (style.mixins && style.mixins instanceof Array) {
    style.mixins.forEach(mixin => {
      mixin = makeStyle(mixin);

      for (let prop in mixin) {
        if (typeof style[prop] == "undefined") {
          style[prop] = mixin[prop];
        }
      }
    });

    delete style.mixins;
  }

  return style;
};

let Style = {
  create: style => StyleSheet.create(makeStyles(style)),
  mixins: require("./mixins"),
  util: {
    lighten: (hexString, amount) =>
      Color(hexString)
        .lighten(amount)
        .hexString(),
    darken: (hexString, amount) =>
      Color(hexString)
        .darken(amount)
        .hexString()
  },
  values: require("./values"),
  themes: require("./themes").default
};

module.exports = Style;
