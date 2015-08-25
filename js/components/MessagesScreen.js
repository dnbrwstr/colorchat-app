import React from 'react-native';
import { connect } from 'react-redux/native';
import { messagesScreenSelector } from '../lib/Selectors';
import { navigateTo } from '../actions/NavigationActions';
import Style from '../style';
import ConversationList from './ConversationList';

let {
  View,
  Text
} = React;

let MessagesScreen = React.createClass({
  render: function () {
    return (
      <View style={style.container}>
        <ConversationList
          conversations={this.props.conversations}
          onSelect={this.onSelectConversation} />
      </View>
    );
  },

  onSelectConversation: function (conversation) {
    this.props.dispatch(navigateTo('conversation', {
      data: {
        contactId: conversation.contact.id
      }
    }));
  }
});

let style = Style.create({
  container: {
    backgroundColor: 'cyan',
    flex: 1,
  }
});

export default connect(messagesScreenSelector)(MessagesScreen);
