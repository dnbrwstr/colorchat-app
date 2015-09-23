let React = require('react-native'),
  Style = require('../style');

import PressableView from './PressableView';

let {
  View,
  Text,
  TouchableOpacity
} = React;

let Header = React.createClass({
  render: function () {
    return (
      <View style={style.bar}>
        <View style={style.buttonContainer}>
          { this.props.showBack &&
            <PressableView
              onPress={this.onBack}
              style={style.button}
              activeStyle={style.buttonActive}
            >
              <Text style={style.buttonText}>Back</Text>
            </PressableView> }
        </View>

        <View style={style.title}>
          { this.props.title &&
            <Text style={style.titleText}>{this.props.title}</Text> }
        </View>

        <View style={style.buttonContainer}>
          { this.props.showClose &&
            <PressableView
              onPress={this.onClose}
              style={style.button}
              activeStyle={style.buttonActive}
            >
              <Text style={style.buttonText}>X</Text>
            </PressableView> }
        </View>
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

var size = 60;

let style = Style.create({
  bar: {
    backgroundColor: Style.values.midGray,
    height: size,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 0
  },
  buttonContainer: {
    width: size,
  },
  button: {
    flex: 1,
    justifyContent: 'center'
  },
  buttonActive: {
    backgroundColor: '#888888'
  },
  buttonText: {
    mixins: [Style.mixins.textBase],
    color: 'white',
    textAlign: 'center'
  },
  title: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    mixins: [Style.mixins.textBase],
    color: 'white',
    textAlign: 'center'
  }
})

module.exports = Header;
