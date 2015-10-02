import React from 'react-native';
import Style from '../style';
import measure from '../measure';
import { hsl2hex } from '../lib/ColorUtils';

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

  onTouchMove: async function (e) {
    let { locationX, locationY } = e.nativeEvent;
    let size = await measure(this.refs.main);
    let progressX = Math.max(Math.min(locationX / size.width, 1), 0);
    let progressY = Math.max(Math.min(locationY / size.height, 1), 0);

    let h = Math.floor(360 * progressX);
    let s = 75;
    let l = Math.floor(100 * progressY);

    this.setState({
      value: hsl2hex({ h, s, l })
    });
  },

  onTouchEnd: function () {
    setTimeout(() => {
      if (this.props.onChange) this.props.onChange(this.state.value)
    }, 100)
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
