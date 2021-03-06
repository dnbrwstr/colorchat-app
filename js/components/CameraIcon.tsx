import React, {FC} from 'react';
import Svg, {Path, Circle} from 'react-native-svg';
import {StyleProp, ViewStyle} from 'react-native';

interface CameraIconProps {
  style?: StyleProp<ViewStyle>;
  strokeWidth: number;
  strokeColor: string;
}

export const CameraIcon: FC<CameraIconProps> = props => {
  return (
    <Svg style={props.style} viewBox="0 0 123 93">
      <Path
        fill="none"
        strokeWidth={props.strokeWidth}
        stroke={props.strokeColor}
        d="M85.6,12.9L79.7,1.5c0,0-36.1,0-36.1,0c0,0-5.9,11.4-5.9,11.4H7c-3.1,0-5.5,2.5-5.5,5.5v67.4
	c0,3.1,2.5,5.5,5.5,5.5h108.3c3.1,0,5.5-2.5,5.5-5.5V18.5c0-3.1-2.5-5.5-5.5-5.5C115.4,12.9,85.6,12.9,85.6,12.9z"
      />
      <Circle
        fill="none"
        strokeWidth={props.strokeWidth}
        stroke={props.strokeColor}
        cx="61.7"
        cy="51.1"
        r="18.7"
      />
    </Svg>
  );
};

const PureCameraIcon = React.memo(CameraIcon);

export default PureCameraIcon;
