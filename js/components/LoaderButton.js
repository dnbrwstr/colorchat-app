let React = require('react-native'),
  Style = require('../style');

import PressableView from './PressableView';

let {
  View,
  Text
} = React;

let LoaderButton = React.createClass({
  getInitialState: () => ({
    active: false
  }),

  render: function () {
    return (
      <PressableView
        style={this.getButtonStyles()}
        activeStyle={styles.buttonActive}
        onPress={this.onPress}
      >
        <Text style={styles.text}>{ this.getMessage() }</Text>
      </PressableView>
    );
  },

  getButtonStyles: function () {
    return [
      styles.button,
      this.props.loading && styles.buttonLoading
    ]
  },

  getMessage: function () {
    return this.props.loading ?
      this.props.messages.loading : this.props.messages.base;
  },

  onPress: function () {
    if (this.props.onPress) this.props.onPress();
  }
});

module.exports = LoaderButton;

var styles = Style.create({
  button: {
    flex: 0,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: Style.values.midGray,
    padding: Style.values.basePadding * 1.5
  },
  buttonActive: {
    backgroundColor: 'black'
  },
  buttonLoading: {
    backgroundColor: 'blue'
  },
  text: {
    color: 'white',
    textAlign: 'center'
  }
});
