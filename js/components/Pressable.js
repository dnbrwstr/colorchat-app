let React = require('react-native');

let { TouchableWithoutFeedback } = React;

let Pressable = React.createClass({
  render: function () {
    return <TouchableWithoutFeedback {...this.props} />
  }
});

module.exports = Pressable;