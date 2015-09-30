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
  render: function () {
    return this.props.state === 'composing' ?
      this.renderEditor() : this.renderMessage();
  },

  renderEditor: function () {
    return <EditableMessage {...this.props} />
  },

  renderMessage: function () {
    let messageStyles = [
      style.message,
      this.props.fromCurrentUser ? style.sent : style.received,
      {
        width: this.props.width,
        height: this.props.height,
        backgroundColor: this.props.color
      }
    ];

    let textColor = {
      color: Color(this.props.color).luminosity() > .5 ?
        'black' : 'white'
    };

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