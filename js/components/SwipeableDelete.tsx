import React, {FC, useMemo, useState, useCallback} from 'react';
import Animated, {Easing} from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
  RectButton,
} from 'react-native-gesture-handler';
import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  LayoutChangeEvent,
  Platform,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import Text from './BaseText';
import {spring} from '../lib/Animation';

const {
  Value,
  Clock,
  event,
  cond,
  lessThan,
  block,
  add,
  multiply,
  eq,
  not,
  and,
  set,
  abs,
  stopClock,
  sub,
  defined,
  proc,
  greaterThan,
  clockRunning,
  startClock,
  interpolate,
  debug,
  timing,
} = Animated;

function runSpring(
  clock: Animated.Clock,
  value: Animated.Node<number>,
  velocity: Animated.Node<number>,
  dest: Animated.Node<number>,
) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    damping: 150,
    mass: 3,
    stiffness: 400,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, [stopClock(clock)]),
    state.position,
  ];
}

const swipeableDeleteTrans = (
  state: Animated.Value<number>,
  dragX: Animated.Value<number>,
  prevDragX: Animated.Value<number>,
  dragVX: Animated.Value<number>,
  transX: Animated.Value<number>,
  clock: Animated.Clock,
) => {
  const WIDTH = 100;
  const TOSS_SEC = 0.5;
  const effectiveDragX = multiply(dragX, 0.4);

  const lastState = new Animated.Value(0);

  const snapPoint = cond(
    lessThan(add(transX, multiply(TOSS_SEC, dragVX)), 0),
    -WIDTH,
    0,
  );

  return block([
    cond(
      eq(state, State.ACTIVE),
      [
        stopClock(clock),
        set(transX, add(transX, sub(effectiveDragX, prevDragX))),
        set(prevDragX, effectiveDragX),
      ],
      0,
    ),
    cond(not(eq(state, State.ACTIVE)), [
      set(prevDragX, 0),
      set(
        transX,
        cond(
          and(defined(transX), greaterThan(abs(dragX), 0)),
          [runSpring(clock, transX, dragVX, snapPoint)],
          transX,
        ),
      ),
      cond(clockRunning(clock), [set(dragVX, 0)]),
    ]),
    transX,
  ]);
};

const makeSwipeableDelete = (config: {
  state: Animated.Value<number>;
  dragX: Animated.Value<number>;
  prevDragX: Animated.Value<number>;
  dragVX: Animated.Value<number>;
  transX: Animated.Value<number>;
  clock: Animated.Clock;
}) =>
  swipeableDeleteTrans(
    config.state,
    config.dragX,
    config.prevDragX,
    config.dragVX,
    config.transX,
    config.clock,
  );

const translateXStyle = (translateX: number | Animated.Node<number>) => {
  return {
    transform: [{translateX}],
  };
};

const useSwipeableDelete = () => {
  return useMemo(() => {
    const animatedValues = {
      state: new Value(-1),
      dragX: new Value(0),
      prevDragX: new Value(0),
      dragVX: new Value(0),
      transX: new Value(0),
      clock: new Clock(),
    };

    const eventConfig = {
      translationX: animatedValues.dragX,
      velocityX: animatedValues.dragVX,
      state: animatedValues.state,
    };

    const handleGestureEvent = event([{nativeEvent: eventConfig}]);
    const transX = makeSwipeableDelete(animatedValues);
    const contentTransformStyle = {
      ...translateXStyle(transX),
      backgroundColor: 'green',
      minHeight: 20,
      flex: 1,
    };
    const buttonTransformStyle = translateXStyle(
      interpolate(transX, {
        inputRange: [-101, -100, -100, 0],
        outputRange: [-1, 0, 0, 100],
      }),
    );

    return {
      handleGestureEvent,
      contentTransformStyle,
      buttonTransformStyle,
    };
  }, []);
};

interface SwipeableDeleteProps {
  style?: StyleProp<ViewStyle>;
  onPressDelete?: () => void;
}

const SwipeableDelete: FC<SwipeableDeleteProps> = props => {
  const {
    handleGestureEvent,
    contentTransformStyle,
    buttonTransformStyle,
  } = useSwipeableDelete();

  const [isExiting, setIsExiting] = useState(false);
  const [hasSetHeight, setHasSetHeight] = useState(false);
  const animatedHeight: Animated.Value<number> = useMemo(
    () => new Animated.Value(0),
    [],
  );

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    console.log('set height');
    animatedHeight.setValue(e.nativeEvent.layout.height);
    setHasSetHeight(true);
  }, []);

  const [deleteButtonIsActive, setDeleteButtonIsActive] = useState(false);
  const handleDeleteButtonStateChange = useCallback((isActive: boolean) => {
    setDeleteButtonIsActive(isActive);
  }, []);

  const runDelete = useCallback(() => {
    if (isExiting) return;
    timing(animatedHeight, {
      toValue: 0,
      duration: 100,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      props.onPressDelete && props.onPressDelete();
    });
  }, [isExiting]);

  const handlePressDelete = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Would you like to delete this conversation?',
          options: ['Delete', 'Cancel'],
          cancelButtonIndex: 1,
          destructiveButtonIndex: 0,
        },
        (optionIndex: number) => {
          if (optionIndex === 0) runDelete();
          else setIsExiting(false);
        },
      );
    } else {
      Alert.alert(
        'Would you like to delete this conversation?',
        undefined,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setIsExiting(false),
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => runDelete(),
          },
        ],
        {
          cancelable: true,
        },
      );
    }
  }, [animatedHeight, isExiting]);

  const {children, style, ...rest} = props;

  return (
    <PanGestureHandler
      {...rest}
      maxPointers={1}
      minDist={1}
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleGestureEvent}
    >
      <Animated.View
        style={[
          styles.container,
          style,
          animatedHeight && {height: animatedHeight},
        ]}
        onLayout={!hasSetHeight ? handleLayout : undefined}
      >
        <View style={styles.deleteButtonContainer}>
          <Animated.View
            style={[
              styles.deleteButton,
              buttonTransformStyle,
              deleteButtonIsActive && styles.deleteButtonActive,
            ]}
          >
            <RectButton
              style={styles.deleteButtonInner}
              onActiveStateChange={handleDeleteButtonStateChange}
              onPress={handlePressDelete}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </RectButton>
          </Animated.View>
        </View>
        <Animated.View style={contentTransformStyle}>{children}</Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  deleteButtonContainer: {
    position: 'absolute',
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    top: 0,
    bottom: 0,
    left: '50%',
    right: 0,
  },
  deleteButton: {
    width: 100,
    height: '100%',
  },
  deleteButtonActive: {
    backgroundColor: '#CC0000',
  },
  deleteButtonText: {
    color: 'white',
  },
  deleteButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 0,
  },
});

export default SwipeableDelete;
