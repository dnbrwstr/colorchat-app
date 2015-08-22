import React from 'react-native';
import Style from '../style';

let {
  View,
  Text
} = React;

let MessageList = React.createClass({
  render: function () {
    return (
      <View style={style.container}>
        <Text>Messages</Text>
      </View>
    );
  }
});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'fuchsia'
  }
});

export default MessageList;
