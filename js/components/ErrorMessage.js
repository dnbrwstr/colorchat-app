let React = require('react-native'),
  Style = require('../style'),
  measure = require('../measure');

let {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  NativeMethodsMixin
} = React;

let ErrorMessage = React.createClass({
  mixins: [NativeMethodsMixin],

  getInitialState: () => ({
    height: new Animated.Value(0)
  }),

  render: function () {
    let animatedStyle = {
      height: this.state.height,
      overflow: 'hidden',
      flex: 1
    };

    return (
      <TouchableWithoutFeedback onPressIn={this.onPressIn} onPressOut={this.onPressOut}>
        <Animated.View style={animatedStyle} onLayout={this.onLayoutView}>
          <View style={style.message} ref="contentView">
            <Text style={style.text} ref="text">{this.props.message}</Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  },

  onLayoutView: function () {
    if (this.state.entered) return;

    this.setState({
      entered: true
    });

    measure(this.refs.contentView).then((p) => {
      Animated.spring(this.state.height, {
        toValue: p.height,
      }).start();
    });
  },

  onPressIn: function () {},

  onPressOut: function () {
    Animated.spring(this.state.height, {
      toValue: 0,
      duration: 50
    }).start(() => {
      if (this.props.onRemove) this.props.onRemove();
    });
  }
});

let style = Style.create({
  message: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: 'black',
  },
  text: {
    mixins: [Style.mixins.textBase],
    padding: 5,
    color: 'white'
  }
});

module.exports = ErrorMessage;