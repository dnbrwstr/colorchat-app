let React = require('react-native'),
  Style = require('../style');

import PressableView from './PressableView';

let {
  View,
  Text,
  TouchableOpacity
} = React;

let Header = React.createClass({
  getDefaultProps: function () {
    return {
      onBack: () => {},
      onClose: () => {}
    };
  },

  render: function () {
    let bgColor = this.props.backgroundColor && {
      backgroundColor: this.props.backgroundColor
    };

    let textColor = this.props.color && {
      color: this.props.color
    };

    let highlightColor = this.props.highlightColor && {
      backgroundColor: this.props.highlightColor
    };

    return (
      <View style={[style.bar, bgColor]}>
        <View style={style.buttonContainer}>
          { this.props.showBack &&
            <PressableView
              onPress={this.onBack}
              style={style.button}
              activeStyle={[style.buttonActive, highlightColor]}
            >
              <Text style={[style.buttonText, textColor]}>Back</Text>
            </PressableView> }
        </View>

        <View style={style.title}>
          { this.props.title &&
            <Text style={[style.titleText, textColor]}>{this.props.title}</Text> }
        </View>

        <View style={style.buttonContainer}>
          { this.props.showClose &&
            <PressableView
              onPress={this.onClose}
              style={style.button}
              activeStyle={[style.buttonActive, highlightColor]}
            >
              <Text style={[style.buttonText, textColor]}>X</Text>
            </PressableView> }
        </View>
      </View>
    )
  },

  onBack: function () {
    this.props.onBack();
  },

  onClose: function () {
    this.props.onClose();
  }
});

var size = Style.values.rowHeight;

let style = Style.create({
  bar: {
    ...Style.mixins.shadowBase,
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
