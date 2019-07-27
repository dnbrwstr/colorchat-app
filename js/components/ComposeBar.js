import React from "react";
import { Animated, Text, StyleSheet, View } from "react-native";
import Style from "../style";
import PressableView from "./PressableView";
import withStyles from "../lib/withStyles";

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
          outputRange: [0, Style.values.composeBarHeight]
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
          style={[styles.button, styles.buttonFirst]}
          activeStyle={styles.buttonActive}
          onPress={this.props.onCancel}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Cancel</Text>
          </View>
        </PressableView>
        <PressableView
          style={[styles.button]}
          activeStyle={styles.buttonActive}
          onPress={this.props.onPressCamera}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Camera</Text>
          </View>
        </PressableView>
        <PressableView
          style={styles.button}
          activeStyle={styles.buttonActive}
          onPress={this.props.onSend}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Send</Text>
          </View>
        </PressableView>
      </Animated.View>
    );
  }
}

const getStyles = theme => ({
  composeBar: {
    height: Style.values.composeBarHeight,
    flexDirection: "row",
    overflow: "hidden",
    borderTopColor: theme.secondaryBorderColor,
    backgroundColor: theme.backgroundColor
  },
  button: {
    flex: 1,
    borderLeftColor: theme.secondaryBorderColor,
    borderLeftWidth: StyleSheet.hairlineWidth
  },
  buttonContent: {
    height: Style.values.rowHeight,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    ...Style.mixins.textBase,
    color: theme.primaryTextColor,
    textAlign: "center"
  },
  buttonFirst: {
    borderLeftWidth: 0
  },
  buttonActive: {
    backgroundColor: theme.highlightColor
  }
});

export default withStyles(getStyles)(ComposeBar);
