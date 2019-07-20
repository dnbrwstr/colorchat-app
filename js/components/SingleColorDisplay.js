import React, { Component } from "react";
import { View, Animated, Easing } from "react-native";
import Color from "color";
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

    return (
      <Animated.View
        style={{ flex: 1, backgroundColor: this.props.animatedColors[0] }}
      />
    );
  }
}

export default SingleColorDisplay;
