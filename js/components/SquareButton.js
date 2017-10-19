import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import {
  Animated,
  View
} from 'react-native';
import Style from '../style';
import PressableView from './PressableView';
import BaseText from './BaseText';

let SquareButton = createReactClass({
  displayName: 'SquareButton',

  propTypes: {
    label: PropTypes.string,
    onPressIn: PropTypes.func,
    onPressOut: PropTypes.func,
    onPress: PropTypes.func,
    style: Animated.View.propTypes.style,
    activeStyle: View.propTypes.style,
    textStyle: View.propTypes.style,
    activeTextStyle: View.propTypes.style
  },

  getDefaultProps: function () {
    return {
      onPressIn: () => {},
      onPressOut: () => {},
      onPress: () => {}
    };
  },

  getInitialState() {
    return {
      active: false,
      animatedScale: new Animated.Value(1)
    };
  },

  handlePressIn: function () {
    let animation = Animated.timing(this.state.animatedScale, {
      toValue: .95,
      duration: 100
    });
    this.runAnimation(animation);
    this.setState({ active: true });
    this.props.onPressIn.apply(null, arguments);
  },

  handlePressOut: function () {
    this.setState({ active: false });
    this.props.onPressOut.apply(null, arguments);
  },

  handlePress: function () {
    let animation = Animated.timing(this.state.animatedScale, {
      toValue: 1,
      duration: 100
    });
    this.runAnimation(animation);
    this.props.onPress.apply(null, arguments);
  },

  runAnimation: function (animation) {
    if (this.state.currentAnimation) {
      this.state.currentAnimation.stop();
    }

    this.setState({ currentAnimation: animation });
    animation.start(() => {
      this.setState({ currentAnimation: null });
    });
  },

  render: function () {
    let buttonStyles = [style.button,
      this.props.style,
      { transform: [
        { scale: this.state.animatedScale }
      ] }
    ];

    let textStyles = [style.text,
      this.props.textStyle,
      this.state.active && style.textActive,
      this.state.active && this.props.activeTextStyle
    ];

    return (
      <PressableView
        style={buttonStyles}
        activeStyle={[style.buttonActive, this.props.activeStyle]}
        onPressIn={this.handlePressIn}
        onPress={this.handlePress}
      >
        <BaseText style={textStyles}>{this.props.label}</BaseText>
      </PressableView>
    );
  },
});

let style = Style.create({
  button: {
    flex: 0,
    justifyContent: 'center',
    height: Style.values.buttonHeight,
    margin: Style.values.outerPadding,
    padding: Style.values.basePadding * 1.5,
    borderColor: Style.values.midGray,
    borderWidth: Style.values.borderWidth
  },
  buttonActive: {},
  text: {
    textAlign: 'center'
  },
  textActive: {}
});

export default SquareButton;
