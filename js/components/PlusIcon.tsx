import React, {Component, PureComponent} from 'react';
import Svg, {Path, Circle, Line} from 'react-native-svg';
import {ViewStyle, StyleProp} from 'react-native';

interface PlusIconProps {
  style: StyleProp<ViewStyle>;
  strokeWidth: number;
  strokeColor: string;
}

class PlusIcon extends PureComponent<PlusIconProps> {
  render() {
    return (
      <Svg style={this.props.style} viewBox="0 0 62 62">
        <Line
          fill="none"
          strokeWidth={this.props.strokeWidth}
          stroke={this.props.strokeColor}
          x1="0"
          y1="31"
          x2="62"
          y2="31"
        />
        <Line
          fill="none"
          strokeWidth={this.props.strokeWidth}
          stroke={this.props.strokeColor}
          x1="31"
          y1="0"
          x2="31"
          y2="62"
        />
      </Svg>
    );
  }
}

export default PlusIcon;
