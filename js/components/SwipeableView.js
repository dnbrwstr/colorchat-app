import React from 'react-native';
import { merge } from 'ramda';
import { extractSingleTouch } from 'TouchEventUtils';
import measure from '../measure';

let {
  Animated,
  View
} = React;

let SwipeableView = React.createClass({
  getDefaultProps: function () {
    return {
      xAxisEnabled: true,
      xAxisThreshold: 20,
      yAxisEnabled: false,
      yAxisThreshold: 20,
      springBack: true,
      deleteEnabled: false,
      deleteAxis: 'x',
      deleteThreshold: .5
    };
  },

  getInitialState: function () {
    return {
      lastTouch: null,
      touchStarted: false,
      touchOrigin: null,
      targetOffset: new Animated.ValueXY(0, 0),
      viewSize: null,
      animatingOut: false,
      animatedWrapperHeight: new Animated.Value(0)
    };
  },

  render: function () {
    let swipeTargetStyle = {
      transform: [
        { translateX: this.state.targetOffset.x },
        { translateY: this.state.targetOffset.y }
      ]
    };

    return (
      <Animated.View
        style={[ this.state.animatingOut && {
          height: this.state.animatedWrapperHeight
        }]}
        onStartShouldSetResponder={()=>true}
        onResponderGrant={this.onTouchStart}
        onResponderMove={this.onTouchMove}
        onResponderReject={this.onTouchEnd}
        onResponderTerminate={this.onTouchEnd}
        onResponderRelease={this.onTouchEnd}
        onResponderTerminationRequest={()=>false}
      >
        <Animated.View
          onLayout={this.measureView}
          style={[this.props.style, swipeTargetStyle]}
          ref="content"
        >
          { this.props.children }
        </Animated.View>
      </Animated.View>
    );
  },

  measureView: async function () {
    let size = await measure(this.refs.content);

    this.setState({
      size
    });
  },

  onTouchStart: function (e) {
    let touch = extractSingleTouch(e.nativeEvent);
    this.setState({
      touchStarted: true,
      touchOrigin: {
        x: touch.pageX,
        y: touch.pageY
      }
    });

    if (this.props.onInteractionStart) this.props.onInteractionStart();
  },

  onTouchMove: function (e) {
    let touch = extractSingleTouch(e.nativeEvent);
    let offsetX = touch.pageX - this.state.touchOrigin.x;
    let offsetY = touch.pageY - this.state.touchOrigin.y;

    if (this.props.xAxisEnabled && Math.abs(offsetX) > this.props.xAxisThreshold) {
      this.state.targetOffset.x.setValue(offsetX);
    }

    if (this.props.yAxisEnabled && Math.abs(offsetY) > this.props.yAxisEnabled) {
      this.state.targetOffset.y.setValue(offsetY);
    }

    this.setState({
      lastTouch: {
        x: touch.pageX,
        y: touch.pageY
      }
    })
  },

  onTouchEnd: function () {
    if (!this.maybeTriggerDelete() && this.props.springBack) {
      Animated.spring(this.state.targetOffset, {
        toValue: {x: 0, y: 0},
        tension: 100,
        friction: 6
      }).start()
    }

    this.setState({
      lastTouch: null,
      touchStarted: false,
      touchOrigin: null
    });

    if (this.props.onInteractionEnd) this.props.onInteractionEnd();
  },

  maybeTriggerDelete: function () {
    if (!this.props.deleteEnabled) return;

    let { touchOrigin, lastTouch, size } = this.state;

    let {
      startVal,
      endVal,
      axisSize,
      finalPositive,
      finalNegative
    } = {
      x: {
        startVal: touchOrigin.x,
        endVal: lastTouch.x,
        axisSize: size.width,
        finalPositive: size.width,
        finalNegative: -size.width
      },
      y: {
        startVal: touchOrigin.y,
        endVal: lastTouch.y,
        axisSize: size.height,
        finalPositive: size.height,
        finaleNegative: -size.height
      }
    }[this.props.deleteAxis];

    let finalOffset = endVal - startVal;

    if (Math.abs(finalOffset) / axisSize > this.props.deleteThreshold) {
      let axisValue = {};
      axisValue[this.props.deleteAxis] =
        finalOffset > 0 ? finalPositive : finalNegative;

      let finalValue = merge(
        {x: 0, y: 0 },
        axisValue
      );

      this.setState({
        animatingOut: true
      });

      this.state.animatedWrapperHeight.setValue(size.height);

      Animated.parallel([
        Animated.spring(this.state.targetOffset, {
          toValue: finalValue,
          friction: 11,
          tension: 200
        }),
        Animated.timing(this.state.animatedWrapperHeight, {
          toValue: 0,
          duration: 200,
          delay: 100
        })
      ]).start();

      return true;
    } else {
      return false;
    }
  }
});

export default SwipeableView;

