import React, {PureComponent} from 'react';
import {
  Animated,
  Easing,
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {getTransformsArray} from '../lib/Utils';

interface PressableBlobProps {
  style?: StyleProp<ViewStyle>;
  activeScale?: number;
  hitSlop?: number;
  onPress: () => void;
}

interface PressableBlobState {
  pressActive: boolean;
}

class PressableBlob extends PureComponent<
  PressableBlobProps,
  PressableBlobState
> {
  static defaultProps = {
    activeScale: 0.75,
    hitSlop: 20,
  };

  state = {
    pressActive: false,
  };

  scale = new Animated.Value(1);
  scaleAnimation?: Animated.CompositeAnimation;
  layout?: LayoutRectangle;
  isTriggering = false;

  componentDidUpdate(
    prevProps: PressableBlobProps,
    prevState: PressableBlobState,
  ) {
    if (prevState.pressActive && !this.state.pressActive) {
      this.animateUp();
    } else if (!prevState.pressActive && this.state.pressActive) {
      this.animateDown();
    }
  }

  animateDown = () => {
    if (this.scaleAnimation) this.scaleAnimation.stop();
    this.scaleAnimation = Animated.timing(this.scale, {
      toValue: this.props.activeScale!,
      duration: 50,
      easing: Easing.in(Easing.linear),
      useNativeDriver: true,
    });
    this.scaleAnimation.start(this.handleDownCompleted);
  };

  animateUp = () => {
    if (this.scaleAnimation) return;
    this.scaleAnimation = Animated.timing(this.scale, {
      toValue: 1,
      duration: 200,
      easing: Easing.elastic(2),
      useNativeDriver: true,
    });
    this.scaleAnimation.start(this.handleUpCompleted);
  };

  handleDownCompleted: Animated.EndCallback = ({finished}) => {
    if (!finished) return;
    this.scaleAnimation = undefined;
    if (!this.state.pressActive) {
      this.animateUp();
    }
  };

  handleUpCompleted: Animated.EndCallback = ({finished}) => {
    if (!finished) return;
    this.scaleAnimation = undefined;
  };

  render() {
    const style = [
      this.props.style,
      {
        transform: [
          ...getTransformsArray(this.props.style),
          {scale: this.scale},
        ],
      },
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
        onStartShouldSetResponderCapture={(e: GestureResponderEvent) => false}
        onMoveShouldSetResponderCapture={(e: GestureResponderEvent) => false}
        onResponderTerminationRequest={() => true}
      >
        {this.props.children}
      </Animated.View>
    );
  }

  handleLayout = ({nativeEvent: {layout}}: LayoutChangeEvent) => {
    this.layout = layout;
  };

  handleTouchDown = () => {
    return true;
  };

  handleTouchOver = ({nativeEvent}: GestureResponderEvent) => {
    return true;
  };

  handleResponderMove = ({
    nativeEvent: {locationX, locationY},
  }: GestureResponderEvent) => {
    if (!this.layout) return;

    const {hitSlop} = this.props;
    const {width, height} = this.layout;
    const outOfBounds =
      locationX < -hitSlop! ||
      locationY < -hitSlop! ||
      locationY - height > hitSlop! ||
      locationX - width > hitSlop!;
    if (outOfBounds && this.state.pressActive) {
      this.setState({pressActive: false});
    } else if (!outOfBounds && !this.state.pressActive) {
      this.setState({pressActive: true});
    }
  };

  handleResponderGrant = () => {
    this.setState({pressActive: true});
  };

  handleResponderRelease = () => {
    if (this.state.pressActive && !this.isTriggering) {
      this.isTriggering = true;
      setTimeout(() => {
        this.props.onPress && this.props.onPress();
        this.isTriggering = false;
      }, 150);
    }
    this.setState({pressActive: false});
  };

  handleResponderTerminate = () => {
    this.setState({pressActive: false});
  };
}

export default PressableBlob;
