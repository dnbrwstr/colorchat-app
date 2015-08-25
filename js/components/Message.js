import React from 'react-native';
import Style from '../style';

let {
  View,
  LayoutAnimation,
  Text
} = React;

let Message = React.createClass({
  render: function () {
    let colorStyle = {
      backgroundColor: this.props.color,
    };

    let sentStyle = {
      marginLeft: 20
    };

    let receivedStyle = {
      marginRight: 20
    };

    let messageStyles = [
      style.message,
      colorStyle,
      this.props.fromCurrentUser ? sentStyle : receivedStyle
    ];

    return <View style={messageStyles}></View>
  }
});

let style = Style.create({
  message: {
    flex: 0,
    height: 60
  }
})

export default Message;