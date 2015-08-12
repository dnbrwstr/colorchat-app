let values = require('./values');

let textBase = {
  fontFamily: 'Courier',
  fontSize: 16,
  color: values.midGray
};

let inputBase = {
  mixins: [textBase],
  height: 40,
  borderColor: values.midGray,
  borderWidth: 1,
  padding: values.basePadding,
  margin: 0
};

let mixins = {
  textBase: textBase,
  inputBase: inputBase
};

module.exports = mixins;
