import React from "react";
import { Animated, View, Text, InteractionManager } from "react-native";
import Style from "../style";
import PressableView from "./PressableView";

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
    let composeBarStyle = [
      style.composeBar,
      {
        opacity: this.state.animationValue,
        height: this.state.animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Style.values.rowHeight]
        })
      }
    ];

    return (
      <Animated.View style={composeBarStyle}>
        <PressableView
          style={[style.button, style.buttonFirst]}
          activeStyle={style.buttonActive}
          onPress={this.props.onCancel}
        >
          <Text style={style.buttonText}>Cancel</Text>
        </PressableView>
        <PressableView
          style={style.button}
          activeStyle={style.buttonActive}
          onPress={this.props.onSend}
        >
          <Text style={style.buttonText}>Send</Text>
        </PressableView>
      </Animated.View>
    );
  }
}

let style = Style.create({
  composeBar: {
    height: Style.values.rowHeight,
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: Style.values.almostBlack
  },
  button: {
    flex: 1,
    justifyContent: "center"
  },
  buttonText: {
    ...Style.mixins.textBase,
    color: "white",
    textAlign: "center"
  },
  buttonFirst: {
    borderRightColor: "rgba(255,255,255,.03)",
    borderRightWidth: 1
  },
  buttonActive: {
    backgroundColor: Style.values.almostBlack
  }
});

export default ComposeBar;
