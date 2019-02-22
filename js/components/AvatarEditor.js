import React, { Component } from "react";
import { View, StyleSheet, Animated } from "react-native";
import SimpleColorPicker from "./SimpleColorPicker";

class AvatarEditor extends Component {
  
  scale = new Animated.Value(1);
  animation = null;

  render() {
    let viewStyles = [
      {
        transform: [
          {
            scale: this.scale
          }
        ]
      },
      this.props.style
    ];

    return (
      <SimpleColorPicker
        {...this.props}
        style={viewStyles}
        onInteractionStart={this.handleInteractionStart}
        onInteractionEnd={this.handleInteractionEnd}
        onChange={this.handleChange}
      />
    );
  }

  handleInteractionStart = () => {
    this.props.onInteractionStart && this.props.onInteractionStart();

    this.animation && this.animation.stop();

    this.animation = Animated.spring(this.scale, {
      toValue: .97,
      friction: 7,
      tension: 150
    });

    this.animation.start();
  };

  handleInteractionEnd = () => {
    this.props.onInteractionEnd && this.props.onInteractionEnd();
    
    this.animation && this.animation.stop();

    this.animation = Animated.spring(this.scale, {
      toValue: 1,
      friction: 7,
      tension: 150
    });

    this.animation.start();
  };

  handleChange = e => {
    this.props.onChange && this.props.onChange(e);
  };
}

export default AvatarEditor;
