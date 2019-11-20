import React, {FC, useState, useRef, useCallback} from 'react';
import {
  Animated,
  StyleProp,
  NativeSyntheticEvent,
  TargetedEvent,
  ViewStyle,
  TextStyle,
  ScaleTransform,
} from 'react-native';
import Style from '../style';
import {useStyles, makeStyleCreator} from '../lib/withStyles';
import PressableView from './PressableView';
import BaseText from './BaseText';
import {Theme} from '../style/themes';

type PressEvent = NativeSyntheticEvent<TargetedEvent>;

const SquareButtonFC: FC<{
  label: string;
  onPressIn?: (e: PressEvent) => void;
  onPressOut?: (e: PressEvent) => void;
  onPress?: (e: PressEvent) => void;
  style?: StyleProp<ViewStyle>;
  activeStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeTextStyle?: StyleProp<TextStyle>;
}> = props => {
  const [isActive, setIsActive] = useState(false);
  const currentAnimation = useRef<Animated.CompositeAnimation>();
  const animatedScale = useRef(new Animated.Value(1));

  const runAnimation = (animation: Animated.CompositeAnimation) => {
    if (currentAnimation.current) {
      currentAnimation.current.stop();
    }
    currentAnimation.current = animation;
    animation.start(() => {
      currentAnimation.current = undefined;
    });
  };

  const onPressIn = useCallback(
    e => {
      let animation = Animated.timing(animatedScale.current, {
        toValue: 0.95,
        duration: 100,
      });
      runAnimation(animation);
      setIsActive(true);
      props.onPressIn && props.onPressIn(e);
    },
    [props.onPressIn],
  );

  const onPressOut = useCallback(
    e => {
      setIsActive(false);
      props.onPressOut && props.onPressOut(e);
    },
    [props.onPressOut],
  );

  const onPress = useCallback(
    e => {
      let animation = Animated.timing(animatedScale.current, {
        toValue: 1,
        duration: 100,
      });
      runAnimation(animation);
      props.onPress && props.onPress(e);
    },
    [props.onPress],
  );

  const {styles} = useStyles(getStyles);

  const transform = {
    transform: [
      ({
        scale: animatedScale.current,
      } as unknown) as ScaleTransform,
    ],
  };

  let buttonStyles = [styles.button, props.style, transform];

  let textStyles = [
    styles.text,
    props.textStyle,
    isActive && styles.textActive,
    isActive && props.activeTextStyle,
  ];

  return (
    <PressableView
      style={buttonStyles}
      activeStyle={[styles.buttonActive, props.activeStyle]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      <BaseText style={textStyles}>{props.label}</BaseText>
    </PressableView>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  button: {
    flex: 0,
    justifyContent: 'center',
    height: Style.values.buttonHeight,
    margin: Style.values.outerPadding,
    padding: Style.values.basePadding * 1.5,
    borderColor: theme.primaryBorderColor,
    borderWidth: Style.values.borderWidth,
  },
  buttonActive: {},
  text: {
    textAlign: 'center',
  },
  textActive: {},
}));

export default SquareButtonFC;
