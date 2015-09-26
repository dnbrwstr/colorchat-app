import React from 'react-native';
import Color from 'color';
import Style from '../style';

let {
  View,
  LayoutAnimation,
  Text,
  Animated
} = React;

let messages = {}

let Message = React.createClass({
  getInitialState: function () {
    let initialHeight = this.props.fresh ? 0 : Style.values.rowHeight;
    return {
      height: new Animated.Value(initialHeight)
    }
  },

  componentDidMount: function () {
    if (this.props.fresh) {
      Animated.spring(this.state.height, {
        toValue: Style.values.rowHeight * 2,
        friction: 4
      }).start(() => {
        if (this.props.onPresent) this.props.onPresent();
      });
    }
  },

  render: function () {
    let sentStyle = {
      marginLeft: 20
    };

    let receivedStyle = {
      marginRight: 20
    };

    let messageStyles = [
      style.message,
      { height: this.state.height },
      { backgroundColor: this.props.color },
      this.props.fromCurrentUser ? sentStyle : receivedStyle
    ];

    let textColor = {
      color: Color(this.props.color).luminosity() > .5 ?
        'black' : 'white'
    }

    return (
      <Animated.View style={messageStyles}>
        { this.props.state === 'failed' &&
          <Text style={[style.text, textColor]}>Unable to send message</Text> }
      </Animated.View>
    );
  }
});

let style = Style.create({
  message: {
    flex: 0
  },
  text: {
    ...Style.mixins.textBase,
    top: 15,
    left: 15,
  }
});

export default Message;