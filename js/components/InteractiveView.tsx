import React from 'react';
import createReactClass from 'create-react-class';
import {
  Animated,
  View,
  NativeSyntheticEvent,
  TouchableMixin,
  Touchable,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import {merge} from 'ramda';
import {extractSingleTouch} from 'fbjs/lib/TouchEventUtils';
import measure from '../lib/measure';
import NativeMethodsMixin from 'NativeMethodsMixin';

const PRESS_RECT = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};

interface InteractiveViewProps {
  style?: StyleProp<ViewStyle>;
  activeStyle?: StyleProp<ViewStyle>;
  swipeEnabled: boolean;
  xAxisEnabled: boolean;
  xAxisThreshold: number;
  yAxisEnabled: boolean;
  yAxisThreshold: number;
  springBack: boolean;
  deleteEnabled: boolean;
  deleteAxis: 'x' | 'y';
  deleteThreshold: number;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

const InteractiveView = createReactClass<InteractiveViewProps, {}>({
  displayName: 'InteractiveView',
  mixins: [Touchable.Mixin, NativeMethodsMixin],

  getDefaultProps: function() {
    return {
      swipeEnabled: false,
      xAxisEnabled: true,
      xAxisThreshold: 5,
      yAxisEnabled: false,
      yAxisThreshold: 5,
      springBack: true,
      deleteEnabled: false,
      deleteAxis: 'x',
      deleteThreshold: 0.5,
    };
  },

  getInitialState: function() {
    return {
      ...this.touchableGetInitialState(),
      lastTouch: null,
      swipeStarted: false,
      pressStarted: false,
      touchOrigin: null,
      targetOffset: new Animated.ValueXY({x: 0, y: 0}),
      viewSize: null,
      animatingOut: false,
      animatedWrapperHeight: new Animated.Value(0),
      interacting: false,
    };
  },

  render: function() {
    let swipeTargetStyle = {
      transform: [
        {translateX: this.state.targetOffset.x},
        {translateY: this.state.targetOffset.y},
      ],
    };

    return (
      <Animated.View
        style={[
          this.state.animatingOut && {
            height: this.state.animatedWrapperHeight,
          },
        ]}
        onStartShouldSetResponder={this.touchableHandleStartShouldSetResponder}
        onResponderTerminationRequest={
          this.touchableHandleResponderTerminationRequest
        }
        onResponderTerminate={this.touchableHandleResponderTerminate}
        onResponderGrant={this.onTouchStart}
        onResponderMove={this.onTouchMove}
        onResponderRelease={this.onTouchEnd}
      >
        <Animated.View
          onLayout={this.measureView}
          style={[
            this.props.style,
            swipeTargetStyle,
            this.state.pressStarted &&
              !this.state.swipeStarted &&
              this.props.activeStyle,
          ]}
          ref="content"
        >
          {this.props.children}
        </Animated.View>
      </Animated.View>
    );
  },

  measureView: function(e: LayoutChangeEvent) {
    this.setState({
      size: e.nativeEvent.layout,
    });
  },

  onTouchStart: function(e: GestureResponderEvent) {
    this.touchableHandleResponderGrant.apply(this, arguments);

    let touch = extractSingleTouch(e.nativeEvent);
    this.setState({
      touchOrigin: {
        x: touch.pageX,
        y: touch.pageY,
      },
    });
  },

  onTouchMove: function(e: GestureResponderEvent) {
    this.touchableHandleResponderMove.apply(this, arguments);

    if (!this.props.swipeEnabled) return;

    let swipeStarted;
    let touch = extractSingleTouch(e.nativeEvent);
    let offsetX = touch.pageX - this.state.touchOrigin.x;
    let offsetY = touch.pageY - this.state.touchOrigin.y;

    if (
      this.props.xAxisEnabled &&
      Math.abs(offsetX) > this.props.xAxisThreshold
    ) {
      swipeStarted = true;
      this.onInteractionStart();
      this.state.targetOffset.x.setValue(offsetX);
    }

    if (
      this.props.yAxisEnabled &&
      Math.abs(offsetY) > this.props.yAxisEnabled
    ) {
      swipeStarted = true;
      this.onInteractionStart();
      this.state.targetOffset.y.setValue(offsetY);
    }

    this.setState({
      swipeStarted: this.state.swipeStarted || !!swipeStarted,
      lastTouch: {
        x: touch.pageX,
        y: touch.pageY,
      },
    });
  },

  onTouchEnd: function(e: GestureResponderEvent) {
    this.touchableHandleResponderRelease.apply(this, arguments);

    this.onInteractionEnd();

    if (!this.state.swipeStarted) return;

    if (!this.maybeTriggerDelete() && this.props.springBack) {
      Animated.spring(this.state.targetOffset, {
        toValue: {x: 0, y: 0},
        tension: 100,
        friction: 6,
      }).start();
    }

    this.setState({
      lastTouch: null,
      swipeStarted: false,
      touchOrigin: null,
    });
  },

  onInteractionStart: function() {
    if (!this.state.interacting) {
      this.setState({interacting: true});
      this.props.onInteractionStart();
    }
  },

  onInteractionEnd: function() {
    if (this.state.interacting) {
      this.setState({interacting: false});
      this.props.onInteractionEnd();
    }
  },

  maybeTriggerDelete: function() {
    const props = this.props as InteractiveViewProps;

    if (!props.deleteEnabled) return;

    let {touchOrigin, lastTouch, size} = this.state;

    const values = {
      x: {
        startVal: touchOrigin.x,
        endVal: lastTouch.x,
        axisSize: size.width,
        finalPositive: size.width,
        finalNegative: -size.width,
      },
      y: {
        startVal: touchOrigin.y,
        endVal: lastTouch.y,
        axisSize: size.height,
        finalPositive: size.height,
        finalNegative: -size.height,
      },
    } as const;

    let {startVal, endVal, axisSize, finalPositive, finalNegative} = values[
      props.deleteAxis
    ];

    let finalOffset = endVal - startVal;

    if (Math.abs(finalOffset) / axisSize > props.deleteThreshold) {
      let value = {x: 0, y: 0};
      value[props.deleteAxis] = finalOffset > 0 ? finalPositive : finalNegative;

      this.setState({
        animatingOut: true,
      });

      this.state.animatedWrapperHeight.setValue(size.height);

      Animated.parallel([
        Animated.spring(this.state.targetOffset, {
          toValue: value,
          friction: 11,
          tension: 200,
        }),
        Animated.timing(this.state.animatedWrapperHeight, {
          toValue: 0,
          duration: 200,
          delay: 100,
        }),
      ]).start(() => {
        this.props.onDelete();
      });

      return true;
    } else {
      return false;
    }
  },

  /**
   * Touchable callbacks copied almost verbatim
   * from TouchableWithoutFeedback.js
   */
  touchableHandlePress: function(e: GestureResponderEvent) {
    if (this.state.swipeStarted) return;
    this.props.onPress && this.props.onPress(e);
  },

  touchableHandleActivePressIn: function(e: GestureResponderEvent) {
    this.setState({pressStarted: true});
    if (this.state.swipeStarted) return;
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut: function(e: GestureResponderEvent) {
    this.setState({pressStarted: false});
    if (this.state.swipeStarted) return;
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandleLongPress: function(e: GestureResponderEvent) {
    if (this.state.swipeStarted) return;
    this.props.onLongPress && this.props.onLongPress(e);
  },

  touchableGetPressRectOffset: function() {
    return PRESS_RECT;
  },

  touchableGetHighlightDelayMS: function() {
    return this.props.delayPressIn || 30;
  },

  touchableGetLongPressDelayMS: function() {
    return this.props.delayLongPress === 0
      ? 0
      : this.props.delayLongPress || 500;
  },

  touchableGetPressOutDelayMS: function() {
    return this.props.delayPressOut || 0;
  },
});

export default InteractiveView;