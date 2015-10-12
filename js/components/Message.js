import React from 'react-native';
import Color from 'color';
import Style from '../style';
import EditableMessage from './EditableMessage';

let {
  View,
  LayoutAnimation,
  Text,
  Animated
} = React;

let messages = {}

let Message = React.createClass({
  getInitialState: function () {
    let initialHeight = this.props.state === 'fresh' ?
      0 : this.props.height;

    return {
      animatedHeight: new Animated.Value(initialHeight)
    };
  },

  render: function () {
    return this.props.state === 'composing' ?
      this.renderEditor() : this.renderMessage();
  },

  componentDidMount: function () {
    if (this.props.state == 'fresh') {
      Animated.spring(this.state.animatedHeight, {
        toValue: this.props.height,
        tension: 150,
        friction: 10
      }).start(this.props.onPresent);
    }
  },

  renderEditor: function () {
    return <EditableMessage {...this.props} />
  },

  renderMessage: function () {
    let textColor = {
      color: Color(this.props.color).luminosity() > .5 ?
        'black' : 'white'
    };

    return (
      <Animated.View style={this.getMessageStyles()}>
        { this.props.state === 'failed' &&
          <Text style={[style.text, textColor]}>Unable to send message</Text> }
      </Animated.View>
    );
  },

  getMessageStyles: function () {
    return [
      style.message,
      this.props.fromCurrentUser ? style.sent : style.received,
      {
        width: this.props.width,
        height: this.state.animatedHeight,
        backgroundColor: this.props.color
      }
    ];
  }
});

let style = Style.create({
  message: {
    flex: 0,
    overflow: 'hidden'
  },
  sent: {
    alignSelf: 'flex-end'
  },
  received: {
    alignSelf: 'flex-start'
  },
  text: {
    ...Style.mixins.textBase,
    top: 15,
    left: 15,
  }
});

export default Message;