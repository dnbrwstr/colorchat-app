import React, {FC, useState, useCallback, PropsWithRef, Ref} from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  ViewProps,
  StyleProp,
  TouchableWithoutFeedbackProps,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';

interface PressableViewProps extends PropsWithRef<ViewProps> {
  style?: any;
  onPress?: (e: GestureResponderEvent) => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
  activeStyle?: StyleProp<ViewStyle>;
  forwardRef?: Ref<TouchableWithoutFeedback>;
}

const PressableView: FC<PressableViewProps> = props => {
  const [isActive, setIsActive] = useState(false);
  const {onPress, ...rest} = props;

  const onPressIn = useCallback(
    e => {
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

  const style = [props.style, isActive && props.activeStyle];

  return (
    <TouchableWithoutFeedback
      ref={props.forwardRef}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onLayout={props.onLayout}
    >
      <Animated.View {...rest} style={style} />
    </TouchableWithoutFeedback>
  );
};

export default PressableView;
