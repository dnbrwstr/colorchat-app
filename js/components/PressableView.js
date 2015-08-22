import React from 'react-native';

let {
  TouchableWithoutFeedback,
  View
} = React;

let PressableView = React.createClass({

  getInitialState: () => ({ active: false }),

  render: function () {
    return (
      <TouchableWithoutFeedback {...this.props} onPressIn={this.onPressIn} onPressOut={this.onPressOut}>
        <View style={this.getStyle()} onLayout={this.props.onLayout}>
          { this.props.children }
        </View>
      </TouchableWithoutFeedback>
    );
  },

  getStyle: function () {
    let baseStyle= this.props.style;
    let style = baseStyle instanceof Array ? baseStyle : [baseStyle];

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
