import React, { Component } from "react";
import { View, StyleSheet, Animated } from "react-native";
import SimpleColorPicker from "./SimpleColorPicker";

class AvatarEditor extends Component {
  scale = new Animated.Value(1);
  animation = null;

  static defaultProps = {
    scaleAxis: "both"
  };

  render() {
    const { style, scaleAxis } = this.props;
    const scaleX = scaleAxis === "x" || scaleAxis === "both";
    const scaleY = scaleAxis === "y" || scaleAxis === "both";

    const transform = [];
    if (scaleX) transform.push({ scaleX: this.scale });
    if (scaleY) transform.push({ scaleY: this.scale });

    const viewStyles = [styles.container, { transform }, style];

    return (
      <SimpleColorPicker
        {...this.props}
        style={viewStyles}
        onInteractionStart={this.handleInteractionStart}
        onInteractionEnd={this.handleInteractionEnd}
        onChange={this.handleChange}
      />
    );
  }

  handleInteractionStart = () => {
    this.props.onInteractionStart && this.props.onInteractionStart();

    this.animation && this.animation.stop();

    this.animation = Animated.spring(this.scale, {
      toValue: 0.97,
      friction: 7,
      tension: 150
    });

    this.animation.start();
  };

  handleInteractionEnd = () => {
    this.props.onInteractionEnd && this.props.onInteractionEnd();

    this.animation && this.animation.stop();

    this.animation = Animated.spring(this.scale, {
      toValue: 1,
      friction: 7,
      tension: 150
    });

    this.animation.start();
  };

  handleChange = e => {
    this.props.onChange && this.props.onChange(e);
  };
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 250,
    borderRadius: 1000
  }
});

export default AvatarEditor;
