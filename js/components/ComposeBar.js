import React from "react";
import {
  Animated,
  View,
  Text,
  InteractionManager,
  StyleSheet
} from "react-native";
import Style from "../style";
import PressableView from "./PressableView";
import withStyles from "../lib/withStyles";

const HEIGHT = Style.values.rowHeight + (1 - StyleSheet.hairlineWidth);

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
    const { styles } = this.props;
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
    borderTopColor: theme.borderColor,
    backgroundColor: theme.backgroundColor
  },
  button: {
    flex: 1,
    justifyContent: "center"
  },
  buttonText: {
    ...Style.mixins.textBase,
    color: theme.primaryTextColor,
    textAlign: "center"
  },
  buttonFirst: {
    borderRightColor: theme.borderColor,
    borderRightWidth: StyleSheet.hairlineWidth
  },
  buttonActive: {
    backgroundColor: theme.highlightColor
  }
});

export default withStyles(getStyles)(ComposeBar);
