import React, { Component } from "react";
import { View, Animated, Easing } from "react-native";
import Text from "./BaseText";
import { makeArray, lerp, makeColorString, valSort, clamp } from "../lib/Utils";
import PressableBlob from "./PressableBlob";
import withStyles from "../lib/withStyles";

class GridColorDisplay extends Component {
  render() {
    const { styles } = this.props;
    const hasColors = this.props.lastColors && this.props.lastColors.length;

    return (
      <View style={styles.container}>
        {hasColors && this.renderGridColors()}
      </View>
    );
  }

  renderGridColors = () => {
    const { styles } = this.props;
    const rows = 4;
    const columns = 4;

    return makeArray(columns).map(y => {
      return (
        <Animated.View style={styles.gridColorColumn} key={y}>
          {makeArray(rows).map(x => {
            const i = x * rows + y;
            return this.renderColor(i);
          })}
        </Animated.View>
      );
    });
  };

  renderColor(i) {
    const {
      styles,
      animatedColors: colors,
      animatedAbsoluteSizes: sizes
    } = this.props;

    const sizeStyle = {
      // flexBasis: sizes[i].interpolate({
      //   inputRange: [20, 100],
      //   outputRange: [2000, 10000]
      // })
    };

    const colorStyle = {
      backgroundColor: colors[i]
    };

    return (
      <Animated.View style={[styles.gridColor, sizeStyle]} key={i}>
        <PressableBlob
          style={styles.gridColorButton}
          onPress={() => this.handleSelectColor(i)}
        >
          <Animated.View style={[styles.gridColorBackground, colorStyle]} />
        </PressableBlob>
      </Animated.View>
    );
  }

  handleSelectColor = i => {
    const value = this.props.getColorValue(i);
    this.props.onSelectColor && this.props.onSelectColor(value);
  };
}

const getStyles = theme => ({
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 1
  },
  gridColorColumn: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  gridColor: {
    flex: 1,
    marginTop: -1
  },
  gridColorButton: {
    flex: 1
  },
  gridColorBackground: {
    flex: 1
  },
  colorFill: {
    flex: 1
  }
});

export default withStyles(getStyles)(GridColorDisplay);
