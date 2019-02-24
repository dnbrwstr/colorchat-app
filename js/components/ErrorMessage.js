import React from "react";
import { Animated, Easing } from "react-native";
import Style from "../style";
import PressableView from "./PressableView";
import BaseText from "./BaseText";
import withStyles from "../lib/withStyles";

class ErrorMessage extends React.Component {
  static defaultProps = {
    onRemove: () => {}
  };

  state = {
    height: new Animated.Value(0),
    opacity: new Animated.Value(0)
  };

  animateIn = async ({
    nativeEvent: {
      layout: { x, y, width, height }
    }
  }) => {
    Animated.parallel([
      Animated.timing(this.state.height, {
        duration: 150,
        toValue: height + 10,
        easing: Easing.out(Easing.ease)
      }),
      Animated.timing(this.state.opacity, {
        duration: 250,
        toValue: 1,
        delay: 300,
        easing: Easing.out(Easing.ease)
      })
    ]).start();
  };

  animateOut = cb => {
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
    const { styles } = this.props;

    let containerStyles = [
      styles.message,
      {
        height: this.state.height,
        opacity: this.state.opacity
      }
    ];

    return (
      <PressableView
        onPress={this.onPress}
        style={containerStyles}
        activeStyle={styles.messageActive}
      >
        <BaseText style={styles.text} onLayout={this.animateIn}>
          {this.props.message}
        </BaseText>
      </PressableView>
    );
  }

  onPress = () => {
    this.animateOut(() => {
      this.props.onRemove();
    });
  };
}

const getStyles = theme => ({
  message: {
    flex: 0,
    opacity: 0,
    overflow: "hidden",
    paddingBottom: 10
  },
  messageActive: {
    opacity: 0.7
  },
  text: {
    flex: 0,
    height: 40,
    padding: 10,
    paddingHorizontal: Style.values.outerPadding,
    color: theme.error.textColor,
    backgroundColor: theme.error.backgroundColor
  }
});

module.exports = withStyles(getStyles)(ErrorMessage);
