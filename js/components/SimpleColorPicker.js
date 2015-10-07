import React from 'react-native';
import Color from 'color';
import Style from '../style';
import measure from '../measure';

let {
  Text,
  View
} = React;

let SimpleColorPicker = React.createClass({
  getDefaultProps: function () {
    return {
      initialValue: '#ccc'
    };
  },

  getInitialState: function () {
    return {
      value: this.props.initialValue
    };
  },

  render: function () {
    return (
      <View ref="main"
        onLayout={this.onLayout}
        onStartShouldSetResponder={() => true}
        onResponderMove={this.onTouchMove}
        onResponderRelease={this.onTouchEnd}
        style={[
          style.container,
          { backgroundColor: this.state.value },
          this.props.style
        ]}>
      </View>
    );
  },

  onLayout: async function () {
    this.setState({
      size: null
    });

    let size = await measure(this.refs.main);

    this.setState({
      size: size
    });
  },

  onTouchMove: async function (e) {
    if (!this.state.size) return;

    let { locationX, locationY } = e.nativeEvent;
    let progressX = Math.max(Math.min(locationX / this.state.size.width, 1), 0);
    let progressY = Math.max(Math.min(locationY / this.state.size.height, 1), 0);

    let h = Math.floor(360 * progressX);
    let s = 75;
    let l = Math.floor(100 * progressY);

    this.setState({
      value: Color({ h, s, l }).hexString()
    });
  },

  onTouchEnd: function () {
    if (this.props.onChange) this.props.onChange(this.state.value)
  },

  getValue: function () {
    return this.state.value;
  }
});

let style = Style.create({
  container: {
    height: 200,
    flex: 0
  }
});

export default SimpleColorPicker;
