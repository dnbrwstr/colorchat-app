let React = require('react-native');

let { StyleSheet } = React;

let makeStyles = function (styles) {
  for (let key in styles) {
    makeStyle(styles[key]);
  }

  return styles;
}

let makeStyle = function (style) {
  if (style.mixins  && style.mixins instanceof Array) {
    style.mixins.forEach((mixin) => {
      mixin = makeStyle(mixin);

      for (let prop in mixin) {
        if (typeof style[prop] == 'undefined') {
          style[prop] = mixin[prop];
        }
      }
    });

    delete style.mixins;
  }

  return style;
}

let Style = {
  create: (style) => StyleSheet.create(makeStyles(style)),
  mixins: require('./mixins'),
  values: require('./values')
};

module.exports = Style;
