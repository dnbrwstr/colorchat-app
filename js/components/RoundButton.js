import React from "react";
import createReactClass from "create-react-class";
import { View, Text, Animated } from "react-native";
import Style from "../style";
import PressableView from "./PressableView";
import TimerMixin from "./mixins/TimerMixin";

const BUTTON_SIZE = 50;

let RoundButton = createReactClass({
  displayName: "RoundButton",
  mixins: [TimerMixin],

  getDefaultProps: function() {
    return {
      onPress: () => {},
      visible: true
    };
  },

  getInitialState: function() {
    let initialOpacity = this.props.visible ? 1 : 0;

    return {
      animatedSize: new Animated.Value(1),
      animatedOpacity: new Animated.Value(initialOpacity)
    };
  },

  componentDidUpdate: function(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.state.animatedSize.setValue(0.75);

      Animated.parallel([
        Animated.timing(this.state.animatedOpacity, {
          toValue: 1,
          duration: 200
        }),
        Animated.spring(this.state.animatedSize, {
          toValue: 1,
          friction: 7,
          tension: 500
        })
      ]).start();
    } else if (prevProps.visible && !this.props.visible) {
      Animated.timing(this.state.animatedOpacity, {
        toValue: 0,
        duration: 200
      }).start();
    }
  },

  componentWillUnmount: function() {
    this.clearAllTimers();
  },

  render: function() {
    let viewStyles = [
      style.button,
      {
        opacity: this.state.animatedOpacity,
        transform: [
          {
            scale: this.state.animatedSize
          }
        ]
      },
      this.props.style
    ];

    return (
      <PressableView
        style={viewStyles}
        onPressIn={this.onPressIn}
        onPress={this.onPress}
        onPressOut={this.onPressOut}
      >
        {this.props.children}
      </PressableView>
    );
  },

  onPressIn: function() {
    Animated.spring(this.state.animatedSize, {
      toValue: 0.75,
      friction: 7,
      tension: 150
    }).start();
  },

  onPressOut: function() {
    let animation = Animated.spring(this.state.animatedSize, {
      toValue: 1,
      friction: 10,
      tension: 400
    });

    animation.start();

    this.setDelayTimer(
      "hideAnimation",
      () => {
        animation.stop();
      },
      200
    );
  },

  onPress: function() {
    if (this.state.leaving || !this.props.visible) return;

    this.setState({
      leaving: true
    });

    this.setDelayTimer(
      "hide",
      () => {
        this.props.onPress();
        this.setState({ leaving: false });
      },
      200
    );
  }
});

let style = Style.create({
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: Style.values.almostBlack,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default RoundButton;
