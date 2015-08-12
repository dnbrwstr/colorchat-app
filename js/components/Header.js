let React = require('React'),
  Style = require('../style'),
  Pressable = require('./Pressable');

let {
  View,
  Text
} = React;

let TopBar = React.createClass({
  render: function () {
    return (
      <View>
        <Pressable style={style.backButton} onPress={this.onBack}>
          { this.props.showBack &&
            <Text>Back</Text> }
        </Pressable>

        <View>
          { this.props.title &&
            <Text>{this.props.title}</Text> }
        </View>

        <Pressable onPress={this.onClose}>
          { this.props.showClose &&
            <Text>X</Text> }
        </Pressable>
      </View>
    )
  },

  onBack: function () {
    if (this.props.showBack && this.props.onBack) this.props.onBack();
  },

  onClose: function () {
    if (this.props.showClose && this.props.onClose) this.props.onClose();
  }
});

let style = Style.create({
  backButton: {

  },
  title: {},
  closeButton: {}
})

module.exports = TopBar;
