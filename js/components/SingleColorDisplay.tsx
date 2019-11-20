import React, {FC, useCallback} from 'react';
import {Animated} from 'react-native';
import PressableView from './PressableView';
import {CameraColor} from '../lib/CameraTypes';

interface SingleColorDisplayProps {
  animatedColors: Animated.Value[];
  getColorValue: (index: number) => CameraColor;
  onSelectColor: (color: CameraColor) => void;
}

const SingleColorDisplay: FC<SingleColorDisplayProps> = props => {
  if (!props.animatedColors) return null;

  const colorStyle = {
    flex: 1,
    backgroundColor: props.animatedColors[0],
  };

  const handlePress = useCallback(() => {
    const value = props.getColorValue(0);
    props.onSelectColor && props.onSelectColor(value);
  }, [props.getColorValue, props.onSelectColor]);

  return (
    <PressableView style={{flex: 1}} onPress={handlePress}>
      <Animated.View style={colorStyle} />
    </PressableView>
  );
};

export default SingleColorDisplay;
