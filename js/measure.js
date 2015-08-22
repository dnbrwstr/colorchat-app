let React = require('react-native');

module.exports = (ref) => new Promise((resolve, reject) =>
  React.NativeModules.UIManager.measure(React.findNodeHandle(ref),
    (x, y, width, height, left, top) => resolve({
      x, y, width, height, left, top
    })
  ));
