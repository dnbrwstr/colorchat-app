import React from 'react-native';
import { connect } from 'react-redux/native';
import { messagesScreenSelector } from '../lib/Selectors';
import { navigateToConversation } from '../actions/NavigationActions';
import { deleteConversation } from '../actions/ConversationActions';
import { setMainTab } from '../actions/AppActions';
import Style from '../style';
import ConversationList from './ConversationList';
import BaseText from './BaseText';
import PressableView from './PressableView';

let {
  View,
  Text
} = React;

let MessagesScreen = React.createClass({
  render: function () {
    return (
      <View style={style.container}>
        { this.props.conversations.length ?
          <ConversationList
            conversations={this.props.conversations}
            onSelect={this.onSelectConversation}
            onDelete={this.onDeleteConversation}
          />
        :
          <View style={style.emptyMessageWrapper}>
            <BaseText style={style.emptyMessage}>
              Select a contact to
            </BaseText>
            <BaseText style={style.emptyMessage}>
              start a conversation
            </BaseText>

            <PressableView
              style={style.contactsButton}
              onPress={this.onPressContactsButton}
            >
              <BaseText style={style.contactsButtonText}>View contacts</BaseText>
            </PressableView>
          </View>
        }
      </View>
    );
  },

  onSelectConversation: function (conversation) {
    this.props.dispatch(navigateToConversation(conversation.contact.id));
  },

  onDeleteConversation: function (conversation) {
    this.props.dispatch(deleteConversation(conversation));
  },

  onPressContactsButton: function () {
    this.props.dispatch(setMainTab('Contacts'))
  }
});

let {
  contentWrapperBase
} = Style.mixins;

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  emptyMessageWrapper: {
    ...contentWrapperBase,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyMessage: {
    textAlign: 'center'
  },
  contactsButton: {
    backgroundColor: Style.values.midGray,
    padding: 12,
    marginTop: 18,
    flex: 0
  },
  contactsButtonText: {
    color: 'white',
    textAlign: 'center',
    flex: 0
  }
});

export default connect(messagesScreenSelector)(MessagesScreen);
