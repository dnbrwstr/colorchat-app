import React from 'react-native';
import Style from '../style';

let {
  View,
  Text
} = React;

let MessagesScreen = React.createClass({
  render: function () {
    return (
      <View style={style.container}>
        <Text>Messagesssss</Text>
      </View>
    );
  }
});

let style = Style.create({
  container: {
    backgroundColor: 'cyan',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default MessagesScreen;
