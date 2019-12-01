import React, {FC, useEffect} from 'react';
import {Animated, View, StyleProp, ViewStyle, StyleSheet} from 'react-native';
import {useAnimatedValue} from '../lib/HookUtils';

const MIN_SIZE = 40;
const MAX_SIZE = 55;

const PlaceholderMessage: FC<{
  style: StyleProp<ViewStyle>;
}> = props => {
  const color = useAnimatedValue(0);
  const width = useAnimatedValue(0);

  useEffect(() => {
    const colorAnimation = Animated.loop(
      Animated.timing(color, {
        toValue: 1,
        duration: 8000,
        isInteraction: false,
      }),
    );

    const widthAnimation = Animated.loop(
      Animated.timing(width, {
        toValue: 1,
        duration: 1500,
        isInteraction: false,
      }),
    );

    colorAnimation.start();
    widthAnimation.start();

    return () => {
      colorAnimation.stop();
      widthAnimation.stop();
    };
  }, []);

  return (
    <View style={[style.container, props.style]}>
      <Animated.View
        style={[
          style.placeholder,
          {
            width: width.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [MIN_SIZE, MAX_SIZE, MIN_SIZE],
            }),
            backgroundColor: color.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [
                'hsl(0, 100%, 50%)',
                'hsl(180, 100%, 50%)',
                'hsl(320, 100%, 50%)',
              ],
            }),
          },
        ]}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    width: MAX_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 20,
    height: 20,
    margin: 0,
    backgroundColor: 'black',
  },
});

export default PlaceholderMessage;
