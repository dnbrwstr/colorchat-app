import React from "react";
import { Animated, Text, StyleSheet } from "react-native";
import Style from "../style";
import PressableView from "./PressableView";
import withStyles from "../lib/withStyles";
import { isIphoneX, ifIphoneX } from "react-native-iphone-x-helper";
import CameraIcon from "./CameraIcon";

const HEIGHT =
  Style.values.rowHeight +
  (1 - StyleSheet.hairlineWidth) +
  (isIphoneX() ? 45 : 0);

class ComposeBar extends React.Component {
  state = {
    animationValue: new Animated.Value(this.props.active ? 1 : 0)
  };

  componentDidUpdate(prevProps) {
    if (this.props.active !== prevProps.active) {
      let nextValue = this.props.active ? 1 : 0;

      Animated.timing(this.state.animationValue, {
        toValue: nextValue,
        duration: 250
      }).start();
    }
  }

  render() {
    const { styles, theme } = this.props;
    let composeBarStyle = [
      styles.composeBar,
      {
        opacity: this.state.animationValue,
        height: this.state.animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, HEIGHT]
        }),
        borderTopWidth: this.state.animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, StyleSheet.hairlineWidth]
        })
      }
    ];

    return (
      <Animated.View style={composeBarStyle}>
        <PressableView
          style={[styles.button, styles.buttonFirst, styles.cameraButton]}
          activeStyle={styles.buttonActive}
          onPress={this.props.onPressCamera}
        >
          <CameraIcon
            style={styles.cameraIcon}
            strokeWidth={4}
            strokeColor={theme.primaryTextColor}
            style={{ width: 33, height: 33 }}
          />
        </PressableView>
        <PressableView
          style={[styles.button, styles.buttonFirst]}
          activeStyle={styles.buttonActive}
          onPress={this.props.onCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </PressableView>
        <PressableView
          style={styles.button}
          activeStyle={styles.buttonActive}
          onPress={this.props.onSend}
        >
          <Text style={styles.buttonText}>Send</Text>
        </PressableView>
      </Animated.View>
    );
  }
}

const getStyles = theme => ({
  composeBar: {
    height: HEIGHT,
    flexDirection: "row",
    overflow: "hidden",
    borderTopColor: theme.secondaryBorderColor,
    backgroundColor: theme.backgroundColor
  },
  cameraButton: {
    flex: 0,
    flexBasis: 80
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
    // ...ifIphoneX({ paddingBottom: 30 })
  },
  buttonText: {
    ...Style.mixins.textBase,
    color: theme.primaryTextColor,
    textAlign: "center"
  },
  buttonFirst: {
    borderRightColor: theme.secondaryBorderColor,
    borderRightWidth: StyleSheet.hairlineWidth
  },
  buttonActive: {
    backgroundColor: theme.highlightColor
  }
});

export default withStyles(getStyles)(ComposeBar);
