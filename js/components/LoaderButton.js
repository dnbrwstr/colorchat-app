let React = require('react-native'),
  Style = require('../style');

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
      <View style={this.getButtonStyles()}
        onStartShouldSetResponder={this.onTouchStart}
        onResponderRelease={this.onTouchEnd}>
        <Text style={styles.text}>{ this.getMessage() }</Text>
      </View>
    );
  },

  getButtonStyles: function () { 
    return [
      styles.button,
      this.state.active && styles.buttonActive,
      this.props.loading && styles.buttonLoading
    ]
  },

  getMessage: function () {
    return this.props.loading ?
      this.props.messages.loading : this.props.messages.base;
  },

  onTouchStart: function () {
    this.setState({
      active: true
    });

    return true;
  },

  onTouchEnd: function () {
    this.setState({
      active: false
    });

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
