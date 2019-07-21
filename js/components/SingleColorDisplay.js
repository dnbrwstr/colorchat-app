import React, { Component } from "react";
import { View, Animated, Easing } from "react-native";
import Color from "color";
import PressableView from "./PressableView";
import { valSort } from "../lib/Utils";

const getSize = v => v.size;
const getLum = color => Color(color).luminosity();
const getSat = color => Color(color).saturation();

const sortFunctions = {
  dominant: valSort(getSize, true),
  dark: valSort(getLum),
  light: valSort(getLum, true),
  saturated: valSort(getSat, true),
  desaturated: valSort(getSat)
};

class SingleColorDisplay extends Component {
  render() {
    if (!this.props.animatedColors) return null;

    const colorStyle = {
      flex: 1,
      backgroundColor: this.props.animatedColors[0]
    };

    return (
      <PressableView style={{ flex: 1 }} onPress={this.handlePress}>
        <Animated.View style={colorStyle} />
      </PressableView>
    );
  }

  handlePress = () => {
    const value = this.props.getColorValue(0);
    this.props.onSelectColor && this.props.onSelectColor(value);
  };
}

export default SingleColorDisplay;
