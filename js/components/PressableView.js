import React from 'react-native';

let {
  TouchableWithoutFeedback,
  View,
  Animated
} = React;

let touchablePropKeys = [
  'accessible',
  'onPress',
  'onLongPress',
  'delayPressIn',
  'delayPressOut',
  'delayLongPress'
];

let sortProps = props =>
  Object.keys(props).reduce((memo, key) => {
    if (touchablePropKeys.indexOf(key) !== -1) {
      memo.touchableProps[key] = props[key];
    } else {
      memo.viewProps[key] = props[key];
    }

    return memo;
  }, {
    touchableProps: {},
    viewProps: {}
  });

let PressableView = React.createClass({
  getInitialState: () => ({ active: false }),

  render: function () {
    let { touchableProps, viewProps } = sortProps(this.props);

    return (
      <TouchableWithoutFeedback
        {...touchableProps}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}>
        <Animated.View {...viewProps} style={this.getStyle()}>
          { this.props.children }
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  },

  getStyle: function () {
    let baseStyle= this.props.style;
    let style = baseStyle instanceof Array ? baseStyle.slice(0) : [baseStyle];

    if (this.state.active) {
      style.push(this.props.activeStyle);
    }

    return style;
  },

  onPressIn: function () {
    this.setState({
      active: true
    });

    if (this.props.onPressIn) this.props.onPressIn.apply(null, arguments);
  },

  onPressOut: function () {
    this.setState({
      active: false
    });

    if (this.props.onPressOut) this.props.onPressOut.apply(null, arguments);
  }
});

export default PressableView;
