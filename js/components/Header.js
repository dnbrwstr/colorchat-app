import React from 'react-native';
import Style from '../style';
import PressableView from './PressableView';

let {
  View,
  Text,
  TouchableOpacity,
  PixelRatio
} = React;

let Header = React.createClass({
  getDefaultProps: function () {
    return {
      onBack: () => {},
      onClose: () => {}
    };
  },

  render: function () {
    let barStyles = [
      style.bar,
      this.props.borderColor && {
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: this.props.borderColor
      }
    ];

    let bgColor = this.props.backgroundColor && {
      backgroundColor: this.props.backgroundColor
    };

    let bgOpacity = typeof this.props.backgroundOpacity === 'number' && {
      opacity: this.props.backgroundOpacity
    };

    let bgStyles = [style.background, bgColor, bgOpacity];

    let textColor = this.props.color && {
      color: this.props.color
    };

    let highlightColor = this.props.highlightColor && {
      backgroundColor: this.props.highlightColor
    };

    return (
      <View style={barStyles}>
        <View style={bgStyles} />

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
              <Text style={[style.buttonText, style.buttonSecondText, textColor]}>X</Text>
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

let style = Style.create({
  bar: {
    height: Style.values.rowHeight,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 0,
    backgroundColor: 'transparent'
  },
  background: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  buttonContainer: {
    width: Style.values.rowHeight,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Style.values.horizontalPadding
  },
  buttonActive: {
    backgroundColor: '#EFEFEF'
  },
  buttonText: {
    ...Style.mixins.textBase,
  },
  buttonSecondText: {
    textAlign: 'right'
  },
  title: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    ...Style.mixins.textBase,
    textAlign: 'center'
  }
})

module.exports = Header;
