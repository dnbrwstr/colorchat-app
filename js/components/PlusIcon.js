import React, { Component } from "react";
import Svg, { Path, Circle, Line } from "react-native-svg";

const PlusIcon = props => {
  return (
    <Svg style={props.style} viewBox="0 0 62 62">
      <Line
        fill="none"
        strokeWidth={props.strokeWidth}
        stroke={props.strokeColor}
        x1="0"
        y1="31"
        x2="62"
        y2="31"
      />
      <Line
        fill="none"
        strokeWidth={props.strokeWidth}
        stroke={props.strokeColor}
        x1="31"
        y1="0"
        x2="31"
        y2="62"
      />
    </Svg>
  );
};

export default PlusIcon;
