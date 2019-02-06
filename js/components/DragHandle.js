import React from "react";
import { Animated, View, Image } from "react-native";
import { Gateway } from "react-gateway";
import Style from "../style";

class DragHandle extends React.Component {
  static defaultProps = {
    onDragStart: () => {},
    onDragMove: () => {},
    onDragStop: () => {}
  };

  state = {
    animatedScale: new Animated.Value(1)
  };

  render() {
    let transformStyle = {
      transform: [{ scale: this.state.animatedScale }]
    };

    return (
      <Gateway into="top">
        <Animated.View
          style={[style.target, this.props.style, transformStyle]}
          onStartShouldSetResponder={() => true}
          onResponderGrant={this.onDragStart}
          onResponderMove={this.onDragMove}
          onResponderReject={this.onDragStop}
          onResponderTerminate={this.onDragStop}
          onResponderRelease={this.onDragStop}
          onResponderTerminationRequest={() => false}
        >
          <View style={style.handle} />
        </Animated.View>
      </Gateway>
    );
  }

  onDragStart = e => {
    Animated.spring(this.state.animatedScale, {
      toValue: 0.75,
      friction: 7,
      tension: 150
    }).start();
    this.props.onDragStart(e);
  };

  onDragMove = e => {
    this.props.onDragMove(e);
  };

  onDragStop = e => {
    Animated.spring(this.state.animatedScale, {
      toValue: 1,
      tension: 400,
      friction: 10
    }).start();
    this.props.onDragStop(e);
  };
}

const HANDLE_SIZE = 25;

let style = Style.create({
  target: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
    marginLeft: -30,
    backgroundColor: "transparent"
  },
  handle: {
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: "white"
  },
  image: {
    position: "absolute",
    top: 5,
    left: 7.5,
    opacity: 0.125
  }
});

export default DragHandle;
