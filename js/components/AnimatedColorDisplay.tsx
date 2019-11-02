import React, {Component, ReactNode} from 'react';
import {View, Animated, Easing} from 'react-native';
import Color from 'color';
import {makeArray, lerp, makeColorString, valSort, clamp} from '../lib/Utils';

interface CameraColor {
  r: number;
  g: number;
  b: number;
  size: number;
}

const getChange = (newColors?: CameraColor[], oldColors?: CameraColor[]) => {
  if (!newColors || !oldColors) return 1;

  return newColors.reduce((memo, color, i) => {
    const lastColor = oldColors[i];
    const d = Math.sqrt(
      Math.pow(lastColor.r - color.r, 2) +
        Math.pow(lastColor.g - color.g, 2) +
        Math.pow(lastColor.b - color.b, 2),
    );

    const p = d / Math.sqrt(Math.pow(255, 2) * 3);
    return memo + p;
  }, 0);
};

const getSize = ({size}: {size: number}) => size;
const getLum = (color: CameraColor) => Color(color).luminosity();
const getSat = (color: CameraColor) => Color(color).saturationl();

const sortFunctions = {
  dominant: valSort(getSize, true),
  dark: valSort(getLum),
  grid: valSort(getLum),
  light: valSort(getLum, true),
  saturated: valSort(getSat, true),
  desaturated: valSort(getSat),
};

const add = (memo: number, n: number) => memo + n;

interface AnimatedColorDisplayProps {
  colors: CameraColor[];
  defaultColor: string;
  displayMode: keyof typeof sortFunctions;
  colorCount: number;
  animationLength: number;
  children: (props: AnimatedColorChildProps) => ReactNode;
}

interface AnimatedColorDisplayState {
  colorAnimation: Animated.CompositeAnimation | null;
  animationPosition: Animated.Value;
  animationStartTime: number;
  animatedColors: Animated.AnimatedInterpolation[];
  animatedAbsoluteSizes: Animated.AnimatedInterpolation[];
  animatedRelativeSizes: Animated.AnimatedInterpolation[];
  sourceColors: CameraColor[];
  lastColors: CameraColor[];
  colors: CameraColor[];
  changeAmount: number;
}

export interface AnimatedColorChildProps {
  colors: CameraColor[];
  lastColors: CameraColor[];
  animationPosition: Animated.Value;
  animatedColors: Animated.AnimatedInterpolation[];
  animatedRelativeSizes: Animated.AnimatedInterpolation[];
  animatedAbsoluteSizes: Animated.AnimatedInterpolation[];
  getColorValue: (i: number) => CameraColor;
}

class AnimatedColorDisplay extends Component<
  AnimatedColorDisplayProps,
  AnimatedColorDisplayState
> {
  static defaultProps = {
    defaultColor: '#333333',
    displayMode: 'grid',
    colorCount: 16,
    animationLength: 250,
  };

  constructor(props: AnimatedColorDisplayProps) {
    super(props);

    const defaultColor = Color(props.defaultColor).rgb();

    const defaultSwatch = {
      r: defaultColor.red(),
      g: defaultColor.green(),
      b: defaultColor.blue(),
      size: 50,
    };

    this.state = {
      colors: makeArray(this.props.colorCount).map(() => defaultSwatch),
      lastColors: new Array(this.props.colorCount).fill(defaultSwatch),
      animationPosition: new Animated.Value(0),
      colorAnimation: null,
      animationStartTime: 0,
      animatedColors: [],
      animatedAbsoluteSizes: [],
      animatedRelativeSizes: [],
      sourceColors: [],
      changeAmount: 0,
    };
  }

  static getDerivedStateFromProps = (
    props: AnimatedColorDisplayProps,
    state: AnimatedColorDisplayState,
  ): Partial<AnimatedColorDisplayState> | null => {
    // Bail if we've already processed these colors
    if (props.colors && props.colors === state.sourceColors) return null;

    const workingColors = props.colors || state.colors;
    const sortedColors = workingColors.sort(sortFunctions[props.displayMode]);
    const workingChange = getChange(state.sourceColors, props.colors);
    const changeAmount = Math.min(0.5, Math.pow(workingChange, 2) * 0.75);

    let workingPositionLerp: number;
    if (state.changeAmount) {
      workingPositionLerp =
        state.changeAmount >= 0.5 ? 0.01 : Math.pow(changeAmount, 2);
    } else {
      workingPositionLerp = changeAmount;
    }

    const workingColorLerp = workingPositionLerp;

    const lastColors = state.colors;

    const nextColors = sortedColors.map((color, i) => {
      const lastColor =
        lastColors && lastColors[i]
          ? lastColors[i]
          : {r: 0, g: 0, b: 0, size: 0};

      return {
        r: lerp(lastColor.r, color.r, workingColorLerp),
        g: lerp(lastColor.g, color.g, workingColorLerp),
        b: lerp(lastColor.b, color.b, workingColorLerp),
        size: lerp(lastColor.size, color.size, workingPositionLerp),
      };
    });

    const animatedColors = [];
    const animatedAbsoluteSizes = [];
    const animatedRelativeSizes = [];

    const lastTotalSize = lastColors.map(getSize).reduce(add, 0);
    const totalSize = nextColors.map(getSize).reduce(add, 0);
    const sizePair = [lastTotalSize, totalSize];

    const interpolatePosition = (outputRange: number[] | string[]) =>
      state.animationPosition.interpolate({
        inputRange: [0, 1],
        outputRange,
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
      easing: Easing.linear,
    });
    const animationStartTime = new Date().getTime();

    return {
      colorAnimation,
      animationStartTime,
      animatedColors,
      animatedAbsoluteSizes,
      animatedRelativeSizes,
      sourceColors: workingColors,
      lastColors: state.colors,
      colors: nextColors,
    };
  };

  componentDidUpdate(
    prevProps: AnimatedColorDisplayProps,
    prevState: AnimatedColorDisplayState,
  ) {
    if (this.state.colors !== prevState.colors) {
      this.updateColorAnimation();
    }
  }

  updateColorAnimation() {
    this.state.colorAnimation && this.state.colorAnimation.start();
  }

  render() {
    const data = {
      colors: this.state.colors,
      lastColors: this.state.lastColors,
      animationPosition: this.state.animationPosition,
      animatedColors: this.state.animatedColors,
      animatedRelativeSizes: this.state.animatedRelativeSizes,
      animatedAbsoluteSizes: this.state.animatedAbsoluteSizes,
      getColorValue: this.getColorValue,
    };

    return this.props.children(data);
  }

  getColorValue = (i: number) => {
    // Rewind a little so we're using the color
    // from when the user decided to tap
    const currentTime = new Date().getTime() - 100;
    const progress =
      (currentTime - this.state.animationStartTime) /
      this.props.animationLength;
    const colors = [this.state.lastColors[i], this.state.colors[i]];
    const estimatedColor = {
      r: lerp(colors[0].r, colors[1].r, progress),
      g: lerp(colors[0].g, colors[1].g, progress),
      b: lerp(colors[0].b, colors[1].b, progress),
      size: lerp(colors[0].size, colors[1].size, progress),
    };
    return estimatedColor;
  };
}

export default AnimatedColorDisplay;
