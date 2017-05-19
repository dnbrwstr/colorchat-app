import React from 'react';
import {
  Text,
  View
} from 'react-native';
import Color from 'color';
import Style from '../style';
import BaseText from './BaseText';
import measure from '../lib/measure';

let SATURATION = 75;

/**
 * Color picker that allows user to select a color by swiping
 * Uses the HSL colorspace: x-axis controls hue, y-axis controls
 * value. Saturation remains constant.
 *
 * Resizes to fit its container
 */
let SimpleColorPicker = React.createClass({
  propTypes: {
    /**
     * Background color prior to user interaction
     */
    initialValue: React.PropTypes.string,

    /**
     * Custom style for container
     */
    style: React.PropTypes.any,

    /**
     * Called when picker value changes.
     * Passes current value as an argument.
     */
    onChange: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      initialValue: '#ccc',
      onChange: () => {}
    };
  },

  getInitialState: function () {
    return {
      value: this.props.initialValue,
      pristine: true
    };
  },

  render: function () {
    let viewStyles = [
      style.container,
      { backgroundColor: this.state.value },
      this.props.style
    ];

    return (
      <View ref="main"
        onLayout={this.onLayout}
        onStartShouldSetResponder={() => true}
        onResponderMove={this.onTouchMove}
        onResponderRelease={this.onTouchEnd}
        style={viewStyles}
      >
        { this.props.showInstructions && this.state.pristine &&
          this.renderInstructions() }
      </View>
    );
  },

  renderInstructions: function () {
    return (
      <View pointerEvents="none" style={style.instructions}>
        <BaseText style={{textAlign: 'center'}} visibleOn={this.state.color}>
          Swipe to{"\n"}change color
        </BaseText>
      </View>
    );
  },

  onLayout: async function () {
    this.setState({
      size: null
    });

    let size = await measure(this.refs.main);

    this.setState({
      size: size
    });
  },

  onTouchMove: function (e) {
    if (!this.state.size) return;

    let { locationX, locationY } = e.nativeEvent;
    let progressX = Math.max(Math.min(locationX / this.state.size.width, 1), 0);
    let progressY = Math.max(Math.min(locationY / this.state.size.height, 1), 0);

    let h = Math.floor(360 * progressX);
    let l = Math.floor(100 * progressY);

    this.setState({
      value: Color({ h, s: SATURATION, l }).hexString(),
      pristine: false
    });
  },

  onTouchEnd: function () {
    this.props.onChange(this.state.value)
  },

  getValue: function () {
    return this.state.value;
  }
});

let style = Style.create({
  container: {
    height: 200,
    flex: 0
  },
  instructions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default SimpleColorPicker;
