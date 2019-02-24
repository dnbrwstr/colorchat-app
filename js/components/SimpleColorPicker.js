import PropTypes from "prop-types";
import React from "react";
import { Text, View, Animated } from "react-native";
import Color from "color";
import Style from "../style";
import BaseText from "./BaseText";

let SATURATION = 75;

/**
 * Color picker that allows user to select a color by swiping
 * Uses the HSL colorspace: x-axis controls hue, y-axis controls
 * value. Saturation remains constant.
 *
 * Resizes to fit its container
 */
class SimpleColorPicker extends React.Component {
  static propTypes = {
    /**
     * Background color prior to user interaction
     */
    initialValue: PropTypes.string,

    /**
     * Custom style for container
     */
    style: PropTypes.any,

    /**
     * Called when picker value changes.
     * Passes current value as an argument.
     */
    onChange: PropTypes.func
  };

  static defaultProps = {
    initialValue: "#ccc",
    onChange: () => {},
    onInteractionStart: () => {},
    onInteractionEnd: () => {}
  };

  state = {
    value: this.props.initialValue,
    pristine: true,
    touchOffset: null
  };

  render() {
    let viewStyles = [
      style.container,
      { backgroundColor: this.state.value },
      this.props.style
    ];

    return (
      <Animated.View
        ref="main"
        onLayout={this.onLayout}
        onStartShouldSetResponder={() => true}
        onStartShouldSetResponderCapture={() => true}
        onResponderGrant={this.onTouchStart}
        onResponderMove={this.onTouchMove}
        onResponderRelease={this.onTouchEnd}
        onResponderTerminationRequest={() => true}
        onMoveShouldSetResponder={() => true}
        onMoveShouldSetResponderCapture={() => true}
        style={viewStyles}
      >
        {this.props.showInstructions &&
          this.state.pristine &&
          this.renderInstructions()}
      </Animated.View>
    );
  }

  renderInstructions = () => {
    return (
      <View pointerEvents="none" style={style.instructions}>
        <BaseText style={{ textAlign: "center" }} visibleOn={this.state.color}>
          Swipe to{"\n"}change color
        </BaseText>
      </View>
    );
  };

  onLayout = async e => {
    this.setState({
      size: e.nativeEvent.layout
    });
  };

  onTouchStart = e => {
    this.props.onInteractionStart();
  };

  onTouchMove = e => {
    if (!this.state.size) return;

    // As of react-native 0.48:
    // locationX and locationY are correct ONLY w regard to the first touch
    // move event in a given gesture, so we use pageX and pageY instead
    let { pageX, pageY, locationX, locationY } = e.nativeEvent;
    let { width, height } = this.state.size;
    let touchOffset;

    if (!this.state.touchOffset) {
      touchOffset = { x: pageX - locationX, y: pageY - locationY };
      this.setState({ touchOffset });
    } else {
      touchOffset = this.state.touchOffset;
    }

    let x = pageX - touchOffset.x;
    let y = pageY - touchOffset.y;
    let progressX = Math.max(Math.min(x / width, 1), 0);
    let progressY = Math.max(Math.min(y / height, 1), 0);

    let h = Math.floor(360 * progressX);
    let l = Math.floor(100 * progressY);

    this.setState({
      value: Color({ h, s: SATURATION, l }).hexString(),
      pristine: false
    });
  };

  onTouchEnd = () => {
    this.setState({
      touchOffset: null
    });

    this.props.onInteractionEnd();
    this.props.onChange(this.state.value);
  };

  getValue = () => {
    return this.state.value;
  };
}

let style = Style.create({
  container: {
    height: 200,
    flex: 0
  },
  instructions: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default SimpleColorPicker;
