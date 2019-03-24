import React, { PureComponent } from "react";
import { Animated, Easing } from "react-native";
import { getTransforms } from "../lib/Utils";

class PressableBlob extends PureComponent {
  static defaultProps = {
    activeScale: 0.75,
    hitSlop: 20
  };

  state = {
    pressActive: false
  };

  scale = new Animated.Value(1);
  scaleAnimation = null;

  layout = null;

  componentDidUpdate(prevProps, prevState) {
    if (prevState.pressActive && !this.state.pressActive) {
      this.animateUp();
    } else if (!prevState.pressActive && this.state.pressActive) {
      this.animateDown();
    }
  }

  animateDown = () => {
    if (this.scaleAnimation) this.scaleAnimation.stop();
    this.scaleAnimation = Animated.timing(this.scale, {
      toValue: this.props.activeScale,
      duration: 50,
      easing: Easing.in(Easing.linear),
      useNativeDriver: true
    });
    this.scaleAnimation.start(this.handleDownCompleted);
  };

  animateUp = () => {
    if (this.scaleAnimation) return;
    this.scaleAnimation = Animated.timing(this.scale, {
      toValue: 1,
      duration: 200,
      easing: Easing.elastic(2),
      useNativeDriver: true
    });
    this.scaleAnimation.start();
  };

  handleDownCompleted = ({ finished }) => {
    if (!finished) return;
    this.scaleAnimation = null;
    if (!this.state.pressActive) {
      this.animateUp();
    }
  };

  render() {
    const style = [
      this.props.style,
      { transform: [...getTransforms(this.props.style), { scale: this.scale }] }
    ];

    return (
      <Animated.View
        style={style}
        onLayout={this.handleLayout}
        onStartShouldSetResponder={this.handleTouchDown}
        onMoveShouldSetResponder={this.handleTouchOver}
        onResponderGrant={this.handleResponderGrant}
        onResponderMove={this.handleResponderMove}
        onResponderRelease={this.handleResponderRelease}
        onResponderTerminate={this.handleResponderTerminate}
        onStartShouldSetResponderCapture={evt => false}
        onMoveShouldSetResponderCapture={evt => false}
        onResponderTerminationRequest={() => true}
      >
        {this.props.children}
      </Animated.View>
    );
  }

  handleLayout = ({ nativeEvent: { layout } }) => {
    this.layout = layout;
  };

  handleTouchDown = () => {
    return true;
  };

  handleTouchOver = ({ nativeEvent }) => {
    return true;
  };

  handleResponderMove = ({ nativeEvent: { locationX, locationY } }) => {
    const { hitSlop } = this.props;
    const { width, height } = this.layout;
    const outOfBounds =
      locationX < -hitSlop ||
      locationY < -hitSlop ||
      locationY - height > hitSlop ||
      locationX - width > hitSlop;
    if (outOfBounds && this.state.pressActive) {
      this.setState({ pressActive: false });
    } else if (!outOfBounds && !this.state.pressActive) {
      this.setState({ pressActive: true });
    }
  };

  handleResponderGrant = () => {
    this.setState({ pressActive: true });
  };

  handleResponderRelease = () => {
    if (this.state.pressActive) {
      setTimeout(() => {
        this.props.onPress && this.props.onPress();
      }, 50);
    }
    this.setState({ pressActive: false });
  };

  handleResponderTerminate = () => {
    this.setState({ pressActive: false });
  };
}

export default PressableBlob;
