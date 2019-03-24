import React, { Component } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";
import Color from "color";
import memoize from "memoize-one";
import { makeArray, lerp, makeColorString, valSort, clamp } from "../lib/Utils";
import PressableBlob from "./PressableBlob";
import withStyles from "../lib/withStyles";

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

  colorAnimation = null;
  colorAnimationValue = new Animated.Value(0);
  animationStartTime = null;

  constructor(props) {
    super(props);
    const { theme } = props;

    const defaultColor = Color(theme.defaultAvatarColor).rgb();
    const defaultSwatch = {
      ...defaultColor,
      size: 50
    };

    this.state = {
      colors: new Array(16).fill(defaultSwatch),
      lastColors: new Array(16).fill(defaultSwatch),
      displayMode: "grid",
      frameCount: 0
    };
  }

  static getDerivedStateFromProps = (props, prevState) => {
    if (props.colors == prevState.sourceColors) return null;

    const colors = props.colors;
    const sortedColors = colors.sort(sortFunctions.grid);

    const workingPositionLerp = positionLerp;
    const workingColorLerp = lerp(
      0.9,
      colorLerp,
      (prevState.frameCount - 3) / 10
    );

    const newColors = sortedColors.map((color, i) => {
      const lastColor =
        prevState.colors && prevState.colors[i]
          ? prevState.colors[i]
          : { r: 0, g: 0, b: 0, size: 0 };

      return {
        r: lerp(lastColor.r, color.r, workingColorLerp),
        g: lerp(lastColor.g, color.g, workingColorLerp),
        b: lerp(lastColor.b, color.b, workingColorLerp),
        size: lerp(lastColor.size, color.size, workingPositionLerp)
      };
    });

    return {
      sourceColors: props.colors,
      lastColors: prevState.colors,
      colors: newColors,
      frameCount: prevState.frameCount + 1
    };
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.colors !== prevState.colors) {
      this.updateColorAnimation();
    }
  }

  updateColorAnimation() {
    if (this.colorAnimation) this.colorAnimation.stop();
    this.colorAnimationValue.setValue(0);
    this.colorAnimation = Animated.timing(this.colorAnimationValue, {
      toValue: 1,
      duration: this.props.animationLength,
      easing: Easing.linear
    });
    this.colorAnimation.start();
    this.animationStartTime = new Date();
  }

  render() {
    const { styles } = this.props;
    const hasColors = this.state.lastColors && this.state.lastColors.length;

    return (
      <View style={styles.container}>
        <View style={[styles.display]}>
          {hasColors && this.renderGridColors()}
        </View>
      </View>
    );
  }

  renderGridColors = () => {
    const { styles } = this.props;
    const rows = 4;
    const columns = 4;

    return makeArray(columns).map(y => {
      return (
        <View style={[styles.gridColorColumn]} key={y}>
          {makeArray(rows).map(x => {
            const i = x * rows + y;
            if (i == 15 && this.props.renderCamera) {
              return this.props.renderCamera();
            } else {
              return this.renderColor(i);
            }
          })}
        </View>
      );
    });
  };

  renderColor(i) {
    const { styles } = this.props;
    return (
      <Animated.View style={[styles.gridColor, this.getSizeStyle(i)]} key={i}>
        <PressableBlob
          style={styles.gridColorButton}
          onPress={() => this.handleSelectColor(i)}
        >
          <Animated.View
            style={[
              styles.gridColorBackground,
              this.getBackgroundColorStyle(i)
            ]}
          />
        </PressableBlob>
      </Animated.View>
    );
  }

  getSizeStyle = i => {
    const colors = [this.state.lastColors[i], this.state.colors[i]];
    return {
      flexBasis: this.colorAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: colors.map(c => clamp(c.size, 20, 100) * 100)
      })
    };
  };

  getBackgroundColorStyle = i => {
    const colors = [this.state.lastColors[i], this.state.colors[i]];
    return {
      backgroundColor: this.colorAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: colors.map(makeColorString)
      })
    };
  };

  handleSelectColor = i => {
    // Rewind a little so we're using the color
    // from when the user decided to tap
    const currentTime = new Date() - 100;
    const progress =
      (currentTime - this.animationStartTime) / this.props.animationLength;
    const colors = [this.state.lastColors[i], this.state.colors[i]];
    const estimatedColor = {
      r: lerp(colors[0].r, colors[1].r, progress),
      g: lerp(colors[0].g, colors[1].g, progress),
      b: lerp(colors[0].b, colors[1].b, progress),
      size: lerp(colors[0].size, colors[1].size, progress)
    };
    this.props.onSelectColor && this.props.onSelectColor(estimatedColor);
  };
}

const getStyles = theme => ({
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
    marginTop: -1,
    flexShrink: 1
  },
  gridColorButton: {
    flex: 1
  },
  gridColorBackground: {
    flex: 1,
    borderRadius: 1000
  },
  colorFill: {
    flex: 1
  }
});

export default withStyles(getStyles)(CameraDisplay);
