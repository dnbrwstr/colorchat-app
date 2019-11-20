import React, {FC, useCallback, useMemo} from 'react';
import {Animated, Easing, ViewStyle} from 'react-native';
import Style from '../style';
import PressableView from './PressableView';
import BaseText from './BaseText';
import withStyles, {useStyles, makeStyleCreator} from '../lib/withStyles';
import {LayoutEvent} from 'react-navigation';
import {Theme} from '../style/themes';

interface ErrorMessageProps {
  message: string;
  onRemove: () => void;
}

const ErrorMessage: FC<ErrorMessageProps> = props => {
  const {styles} = useStyles(getStyles);
  const animatedHeight = useMemo(() => new Animated.Value(0), []);
  const animatedOpacity = useMemo(() => new Animated.Value(0), []);

  let containerStyles = [
    styles.message,
    ({
      height: animatedHeight,
      opacity: animatedOpacity,
    } as any) as ViewStyle,
  ];

  const animateIn = useCallback(
    ({
      nativeEvent: {
        layout: {height},
      },
    }: LayoutEvent) => {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          duration: 150,
          toValue: height + 10,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(animatedOpacity, {
          duration: 250,
          toValue: 1,
          delay: 300,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    },
    [],
  );

  const animateOut = useCallback((callback?: () => void) => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        duration: 150,
        toValue: 0,
        delay: 300,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(animatedOpacity, {
        duration: 250,
        toValue: 0,
        delay: 0,
        easing: Easing.out(Easing.ease),
      }),
    ]).start(callback);
  }, []);

  const handlePress = useCallback(() => {
    animateOut(() => {
      props.onRemove();
    });
  }, [props.onRemove]);

  return (
    <PressableView
      onPress={handlePress}
      style={containerStyles}
      activeStyle={styles.messageActive}
    >
      <BaseText style={styles.text} onLayout={animateIn}>
        {props.message}
      </BaseText>
    </PressableView>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  message: {
    flex: 0,
    opacity: 0,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  messageActive: {
    opacity: 0.7,
  },
  text: {
    flex: 0,
    height: 40,
    padding: 10,
    paddingHorizontal: Style.values.outerPadding,
    color: theme.error.textColor,
    backgroundColor: theme.error.backgroundColor,
  },
}));

export default ErrorMessage;
