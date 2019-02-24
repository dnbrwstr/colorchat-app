import React, { Component } from "react";
import Svg, { Path, Circle, Line } from "react-native-svg";

const SliderIcon = props => {
  return (
    <Svg style={props.style} viewBox="0 0 62 62">
      <Line
        fill="none"
        strokeWidth={props.strokeWidth}
        stroke={props.strokeColor}
        x1="56"
        y1="17.5"
        x2="18"
        y2="17.5"
      />
      <Line
        fill="none"
        strokeWidth={props.strokeWidth}
        stroke={props.strokeColor}
        x1="44"
        y1="44.5"
        x2="4.5"
        y2="44.5"
      />
      <Circle
        fill="none"
        strokeWidth={props.strokeWidth}
        stroke={props.strokeColor}
        cx="9.75"
        cy="17.5"
        r="8.25"
      />
      <Circle
        fill="none"
        strokeWidth={props.strokeWidth}
        stroke={props.strokeColor}
        cx="52.25"
        cy="44.5"
        r="8.25"
      />
    </Svg>
  );
};

export default SliderIcon;
