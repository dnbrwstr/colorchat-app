import React, { Component } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";
import Color from "color";
import { makeArray, lerp, makeColorString, valSort, clamp } from "../lib/Utils";

const positionLerp = 0.1;
const colorLerp = 0.5;

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

class CameraDisplay extends Component {
  static defaultProps = {
    animationLength: 500
  };

  state = {
    colors: null,
    lastColors: null,
    displayMode: "grid",
    frameCount: 0
  };

  colorAnimation = null;
  colorAnimationValue = new Animated.Value();
  viewOpacity = new Animated.Value(1);

  componentDidUpdate(prevProps, prevState) {
    if (this.props.colors !== prevProps.colors) {
      this.updateColors();
    }

    if (this.props.displayMode !== prevProps.displayMode) {
      this.updateDisplayMode();
    }

    if (this.state.colors !== prevState.colors) {
      this.updateColorAnimation();
    }
  }

  updateColors() {
    const colors = this.props.colors;
    const sortedColors = colors.sort(sortFunctions[this.state.displayMode]);

    const workingPositionLerp = positionLerp;

    const newColors = sortedColors.map((color, i) => {
      const lastColor =
        this.state.colors && this.state.colors[i]
          ? this.state.colors[i]
          : { r: 0, g: 0, b: 0, size: 0 };

      return {
        r: lerp(lastColor.r, color.r, colorLerp),
        g: lerp(lastColor.g, color.g, colorLerp),
        b: lerp(lastColor.b, color.b, colorLerp),
        size: lerp(lastColor.size, color.size, workingPositionLerp)
      };
    });

    this.setState({
      lastColors: this.state.colors ? this.state.colors : newColors,
      colors: newColors,
      frameCount: this.state.frameCount + 1
    });
  }

  updateColorAnimation() {
    if (this.colorAnimation) this.colorAnimation.stop();
    this.colorAnimationValue.setValue(0);
    this.colorAnimation = Animated.timing(this.colorAnimationValue, {
      toValue: 1,
      duration: this.props.animationLength,
      easing: Easing.linear
    }).start();
  }

  updateDisplayMode() {
    if (this.opacityAnimation) this.opacityAnimation.stop();

    this.opacityAnimation = Animated.timing(this.viewOpacity, {
      toValue: 0,
      duration: 300
    }).start(({ finished }) => {
      if (!finished) return;
      const { displayMode } = this.props;
      this.setState({
        displayMode: displayMode,
        colors: this.state.colors.sort(sortFunctions[displayMode]),
        lastColors: this.state.lastColors.sort(sortFunctions[displayMode]),
        frameCount: this.state.displayMode === "average" ? 0 : 6
      });
      this.opacityAnimation = Animated.timing(this.viewOpacity, {
        toValue: 1,
        duration: 300
      }).start();
    });
  }

  render() {
    const hasColors = this.state.lastColors && this.state.lastColors.length;

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.display, { opacity: this.viewOpacity }]}>
          {hasColors
            ? this.state.displayMode === "grid"
              ? this.renderGridColors()
              : this.renderBlock()
            : null}
        </Animated.View>
      </View>
    );
  }

  renderGridColors = () => {
    const rows = 4;
    const columns = 4;

    return makeArray(columns).map(y => {
      return (
        <View style={[styles.gridColorColumn]} key={y}>
          {makeArray(rows).map(x => {
            const i = x * rows + y;
            return (
              <Animated.View
                style={[styles.gridColor, this.getColorStyle(i)]}
                key={i}
              />
            );
          })}
        </View>
      );
    });
  };

  renderBlock() {
    return <Animated.View style={[styles.color, this.getColorStyle(0)]} />;
  }

  getColorStyle = i => {
    const colors = [this.state.lastColors[i], this.state.colors[i]];

    const backgroundColor = this.colorAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: colors.map(makeColorString)
    });

    const flexBasis = this.colorAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: colors.map(c => clamp(c.size, 20, 100) * 100)
    });

    return { backgroundColor, flexBasis };
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  display: {
    flex: 1,
    flexDirection: "row",
    marginTop: 1
  },
  color: {
    borderRadius: 100,
    marginHorizontal: 0,
    flexShrink: 1
  },
  gridColorColumn: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  gridColor: {
    borderRadius: 10000,
    marginTop: -1,
    flexShrink: 1
  }
});

export default CameraDisplay;
