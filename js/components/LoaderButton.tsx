import React, {FC, useMemo} from 'react';
import {
  View,
  Animated,
  NativeSyntheticEvent,
  TargetedEvent,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import Style from '../style';
import AnimatedEllipsis from './AnimatedEllipsis';
import SquareButton from './SquareButton';
import {useUpdateEffect} from '../lib/HookUtils';

interface LoaderButtonProps {
  loading: boolean;
  message: string;
  onPress: (e: NativeSyntheticEvent<TargetedEvent>) => void;
}

const LoaderButton: FC<LoaderButtonProps> = props => {
  const buttonOpacity = useMemo(() => {
    const startOpacity = props.loading ? 0 : 1;
    return new Animated.Value(startOpacity);
  }, []);

  useUpdateEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (props.loading) {
      animation = Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 100,
      });
    } else {
      animation = Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 100,
      });
    }
    animation.start();
    return () => {
      animation.stop();
    };
  }, [props.loading]);

  const opacityStyle = (useMemo(() => {
    return {opacity: buttonOpacity};
  }, []) as any) as ViewStyle;

  return (
    <View>
      {props.loading && (
        <View style={style.ellipsisContainer}>
          <AnimatedEllipsis />
        </View>
      )}

      <SquareButton
        style={opacityStyle}
        label={props.message}
        onPress={props.onPress}
      />
    </View>
  );
};

const style = StyleSheet.create({
  ellipsisContainer: {
    position: 'absolute',
    top: Style.values.outerPadding,
    left: Style.values.outerPadding,
    right: Style.values.outerPadding,
    bottom: Style.values.outerPadding,
    height: Style.values.buttonHeight,
    padding: Style.values.basePadding * 1.5,
  },
});

const MemoizedLoaderButton = React.memo(LoaderButton);

export default MemoizedLoaderButton;
