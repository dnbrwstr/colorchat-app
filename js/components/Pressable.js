let React = require('react-native');

let { TouchableWithoutFeedback } = React;

let Pressable = React.createClass({

  getInitialState: () => ({ active: false }),

  render: function () {
    return (
      <TouchableWithoutFeedback {...this.props} onPressIn={this.onPressIn} onPressOut={this.onPressOut}>
        { React.cloneElement(this.props.children, {
          style: this.getStyle()
        }) }
      </TouchableWithoutFeedback>
    );
  },

  getStyle: function () {
    let childStyle = this.props.children.props.style;
    let style = childStyle instanceof Array ? childStyle : [childStyle];

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

module.exports = Pressable;