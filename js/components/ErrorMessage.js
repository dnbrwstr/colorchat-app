import React  from 'react';
import {
  View,
  Text,
  Animated,
  Easing
} from 'react-native';
import Style  from '../style';
import measure  from '../lib/measure';
import PressableView from './PressableView';
import BaseText from './BaseText';

class ErrorMessage extends React.Component {
  static defaultProps = {
    onRemove: () => {}
  };

  state = {
    height: new Animated.Value(0),
    opacity: new Animated.Value(0)
  };

  animateIn = async ({ x, y, width, height }) => {
    Animated.parallel([
      Animated.timing(this.state.height, {
        duration: 150,
        toValue: height,
        easing: Easing.bounce
      }),
      Animated.timing(this.state.opacity, {
        duration: 250,
        toValue: 1,
        delay: 300,
        easing: Easing.out(Easing.ease)
      })
    ]).start();
  };

  animateOut = (cb) => {
    Animated.parallel([
      Animated.timing(this.state.height, {
        duration: 150,
        toValue: 0,
        delay: 300,
        easing: Easing.out(Easing.ease)
      }),
      Animated.timing(this.state.opacity, {
        duration: 250,
        toValue: 0,
        delay: 0,
        easing: Easing.out(Easing.ease)
      })
    ]).start(cb);
  };

  componentWillUpdate(nextProps, nextState) {
    nextState.closing && this.onRemove();
  }

  render() {
    let styles = [
      style.message,
      {
        height: this.state.height,
        opacity: this.state.opacity
      }
    ];

    return (
      <PressableView
        onPress={this.onPress}
        style={styles}
        activeStyle={style.messageActive}
        ref="contentView"
      >
        <BaseText style={style.text} onLayout={this.animateIn} ref="text">{this.props.message}</BaseText>
      </PressableView>
    );
  }

  onPress = () => {
    this.animateOut(() => {
      this.props.onRemove();
    });
  };
}

let textPadding = 10;

let style = Style.create({
  message: {
    flex: 0,
    opacity: 0,
    backgroundColor: 'black',
    overflow: 'hidden'
  },
  messageActive: {
    backgroundColor: '#333'
  },
  text: {
    padding: textPadding * .6,
    paddingHorizontal: textPadding,
    color: 'white'
  }
});

module.exports = ErrorMessage;