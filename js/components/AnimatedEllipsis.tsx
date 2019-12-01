import React, {FC, useState, useEffect, useRef} from 'react';
import {View, LayoutAnimation, StyleSheet} from 'react-native';
import {times} from 'ramda';
import Style from '../style';

const AnimatedEllipsis: FC<{
  duration?: number;
}> = ({duration = 500}) => {
  const [dotCount, setDotCount] = useState(2);
  const dotCountRef = useRef(dotCount);

  useEffect(() => {
    dotCountRef.current = dotCount;
  }, [dotCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextDotCount = dotCountRef.current + 1;
      if (nextDotCount > 3) nextDotCount = 0;
      LayoutAnimation.spring();
      setDotCount(nextDotCount);
    }, duration);
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <View style={style.container}>
      {times(i => {
        const dotStyle = [style.dot, i < dotCount && style.activeDot];
        return <View style={dotStyle} key={`dot-${i}`} />;
      }, 3)}
    </View>
  );
};

const size = 2;

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dot: {
    borderRadius: size / 2,
    margin: size / 3,
    width: size,
    height: size,
    backgroundColor: Style.values.midGray,
    opacity: 0,
  },
  activeDot: {
    opacity: 1,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    margin: 5 / 3,
  },
});

export default AnimatedEllipsis;
