import React from 'react-native';
import { connect } from 'react-redux/native';
import { inboxScreenSelector } from '../lib/Selectors';
import { navigateToConversation } from '../actions/NavigationActions';
import { deleteConversation } from '../actions/ConversationActions';
import { setMainTab } from '../actions/AppActions';
import { navigateTo } from '../actions/NavigationActions';
import Style from '../style';
import ConversationList from './ConversationList';
import BaseText from './BaseText';
import PressableView from './PressableView';
import NewMessageButton from './NewMessageButton';

let {
  View,
  Text
} = React;

const BR = "\n";

let InboxScreen = React.createClass({
  handleAddConversation: function () {
    this.props.dispatch(navigateTo('contacts'))
  },

  render: function () {
    return (
      <View style={style.container}>
        { this.props.conversations.length ?
          this.renderConversations() : this.renderEmptyMessage() }
        <NewMessageButton onPress={this.handleAddConversation} />
      </View>
    );
  },

  renderConversations: function () {
    return (
      <ConversationList
        conversations={this.props.conversations}
        onSelect={this.onSelectConversation}
        onDelete={this.onDeleteConversation}
      />
    );
  },

  renderEmptyMessage: function () {
    return (
      <View style={style.emptyMessageWrapper}>
        <BaseText style={style.emptyMessage}>
          Use the plus button in the{BR}lower right to select a contact{BR}and start a conversation
        </BaseText>
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
    alignItems: 'center',
    backgroundColor: '#EFEFEF'
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

export default connect(inboxScreenSelector)(InboxScreen);
