import React, { Component } from "react";
import { Animated, StyleSheet } from "react-native";
import PressableBlob from "./PressableBlob";

class SpringButton extends Component {
  static defaultProps = {
    visible: true
  };

  animatedOpacity = null;
  opacityAnimation = null;

  constructor(props) {
    super(props);
    const initialOpacity = this.props.visible ? 1 : 0;
    this.animatedOpacity = new Animated.Value(initialOpacity);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.opacityAnimation != null) this.opacityAnimation.stop();
      const nextOpacity = this.props.visible ? 1 : 0;
      this.opacityAnimation = Animated.timing(this.animatedOpacity, {
        toValue: nextOpacity,
        duration: 200
      });
      this.opacityAnimation.start();
    }
  }

  render() {
    const opacityStyle = {
      opacity: this.animatedOpacity
    };

    return (
      <Animated.View style={[this.props.style, opacityStyle]}>
        <PressableBlob
          style={[styles.content, this.props.contentStyle]}
          onPress={this.props.onPress}
        >
          {this.props.children}
        </PressableBlob>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
});

export default SpringButton;
