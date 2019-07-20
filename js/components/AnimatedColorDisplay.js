import React, { Component } from "react";
import { View, Animated, Easing } from "react-native";
import Color from "color";
import { makeArray, lerp, makeColorString, valSort, clamp } from "../lib/Utils";

const getChange = (newColors, oldColors) => {
  if (!newColors || !oldColors) return 1;

  return newColors.reduce((memo, color, i) => {
    const lastColor = oldColors[i];
    const d = Math.sqrt(
      Math.pow(lastColor.r - color.r, 2) +
        Math.pow(lastColor.g - color.g, 2) +
        Math.pow(lastColor.b - color.b, 2)
    );

    const p = d / Math.sqrt(Math.pow(255, 2) * 3);
    return memo + p;
  }, 0);
};

const getSize = v => v.size;
const getLum = color => Color(color).luminosity();
const getSat = color => Color(color).saturation();

const sortFunctions = {
  dominant: valSort(getSize, true),
  dark: valSort(getLum),
  grid: valSort(getLum),
  light: valSort(getLum, true),
  saturated: valSort(getSat, true),
  desaturated: valSort(getSat)
};

const add = (memo, n) => memo + n;

class AnimatedColorDisplay extends Component {
  static defaultProps = {
    defaultColor: "#333333",
    displayMode: "grid",
    colorCount: 16,
    animationLength: 250
  };

  animationStartTime = null;

  constructor(props) {
    super(props);

    const defaultColor = Color(props.defaultColor).rgb();
    const defaultSwatch = {
      ...defaultColor,
      size: 50
    };

    this.state = {
      colors: makeArray(this.props.colorCount).map(() => defaultSwatch),
      lastColors: new Array(this.props.colorCount).fill(defaultSwatch),
      animationPosition: new Animated.Value(0),
      colorAnimation: null
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.colors && props.colors === state.sourceColors) return null;
    const workingColors = props.colors || state.colors;
    const sortedColors = workingColors.sort(sortFunctions[props.displayMode]);
    const workingChange = getChange(state.sourceColors, props.colors);
    const changeAmount = Math.min(0.5, Math.pow(workingChange, 2) * 0.75);

    const workingPositionLerp =
      state.changeAmount >= 0.5 ? 0.01 : Math.pow(changeAmount, 2);
    const workingColorLerp = workingPositionLerp;

    const lastColors = state.colors;

    const nextColors = sortedColors.map((color, i) => {
      const lastColor =
        lastColors && lastColors[i]
          ? lastColors[i]
          : { r: 0, g: 0, b: 0, size: 0 };

      return {
        r: lerp(lastColor.r, color.r, workingColorLerp),
        g: lerp(lastColor.g, color.g, workingColorLerp),
        b: lerp(lastColor.b, color.b, workingColorLerp),
        size: lerp(lastColor.size, color.size, workingPositionLerp)
      };
    });

    const animatedColors = [];
    const animatedAbsoluteSizes = [];
    const animatedRelativeSizes = [];

    const lastTotalSize = lastColors.reduce(add, 0);
    const totalSize = nextColors.reduce(add, 0);
    const sizePair = [lastTotalSize, totalSize];

    const interpolatePosition = outputRange =>
      state.animationPosition.interpolate({
        inputRange: [0, 1],
        outputRange
      });

    for (let i = 0; i < props.colorCount; ++i) {
      const colorPair = [lastColors[i], nextColors[i]];

      const colorRange = colorPair.map(makeColorString);
      const absoluteSizeRange = colorPair.map(c => c.size);
      const relativeSizeRange = colorPair.map((c, i) => c.size / sizePair[i]);

      animatedColors.push(interpolatePosition(colorRange));
      animatedAbsoluteSizes.push(interpolatePosition(absoluteSizeRange));
      animatedRelativeSizes.push(interpolatePosition(relativeSizeRange));
    }

    if (state.colorAnimation) state.colorAnimation.stop();
    state.animationPosition.setValue(0);
    const colorAnimation = Animated.timing(state.animationPosition, {
      toValue: 1,
      duration: props.animationLength,
      easing: Easing.linear
    });
    const animationStartTime = new Date();

    return {
      colorAnimation,
      animationStartTime,
      animatedColors,
      animatedAbsoluteSizes,
      animatedRelativeSizes,
      sourceColors: workingColors,
      lastColors: state.colors,
      colors: nextColors
    };
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.colors !== prevState.colors) {
      this.updateColorAnimation();
    }
  }

  updateColorAnimation() {
    this.state.colorAnimation.start();
  }

  render() {
    const data = {
      colors: this.state.colors,
      lastColors: this.state.lastColors,
      animationPosition: this.state.animationValue,
      animatedColors: this.state.animatedColors,
      animatedRelativeSizes: this.state.animatedRelativeSizes,
      animatedAbsoluteSizes: this.state.animatedAbsoluteSizes,
      getColorValue: this.getColorValue
    };

    return this.props.children(data);
  }

  getColorValue = i => {
    // Rewind a little so we're using the color
    // from when the user decided to tap
    const currentTime = new Date() - 100;
    const progress =
      (currentTime - this.state.animationStartTime) /
      this.props.animationLength;
    const colors = [this.state.lastColors[i], this.state.colors[i]];
    const estimatedColor = {
      r: lerp(colors[0].r, colors[1].r, progress),
      g: lerp(colors[0].g, colors[1].g, progress),
      b: lerp(colors[0].b, colors[1].b, progress),
      size: lerp(colors[0].size, colors[1].size, progress)
    };
    return estimatedColor;
  };
}

export default AnimatedColorDisplay;
