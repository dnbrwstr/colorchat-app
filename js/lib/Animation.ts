import Animated from 'react-native-reanimated';

const {proc, spring: originalSpring} = Animated;

const betterSpring = proc(
  (
    clock,
    finished,
    velocity,
    position,
    time,
    prevPosition,
    toValue,
    damping,
    mass,
    stiffness,
    overshootClamping,
    restDisplacementThreshold,
    restSpeedThreshold,
  ) =>
    originalSpring(
      clock,
      {
        finished,
        velocity,
        position,
        time,
        // @ts-ignore Ignore bad typing...
        prevPosition,
      },
      {
        toValue,
        damping,
        mass,
        stiffness,
        overshootClamping,
        restDisplacementThreshold,
        restSpeedThreshold,
      },
    ),
);

export const spring = (
  clock: Animated.Clock,
  state: Animated.PhysicsAnimationState,
  config: Animated.SpringConfig,
) => {
  return betterSpring(
    clock,
    state.finished,
    state.velocity,
    state.position,
    state.time,
    // @ts-ignore Ignore bad typing...
    state.prevPosition,
    config.toValue,
    config.damping,
    config.mass,
    config.stiffness,
    // @ts-ignore Ignore bad typing...
    config.overshootClamping,
    config.restDisplacementThreshold,
    config.restSpeedThreshold,
  );
};
