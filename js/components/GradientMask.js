import React from "react";
import {
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Ellipse
} from "react-native-svg";

const GradientMask = props => {
  return (
    <Svg
      style={[{ flex: 1 }, props.style]}
      height={props.height}
      width={props.width}
    >
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2={props.width} y2="0">
          <Stop offset="0" stopColor={props.fadeColor} stopOpacity="0" />
          <Stop offset="0.5" stopColor={props.fadeColor} stopOpacity="1" />
        </LinearGradient>
      </Defs>

      <Rect
        width={props.width}
        height={props.height}
        x="0"
        y="0"
        fill="url(#grad)"
      />
    </Svg>
  );
};

export default GradientMask;
