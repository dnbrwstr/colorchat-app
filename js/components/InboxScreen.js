import React from 'react';
import {
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { inboxScreenSelector } from '../lib/Selectors';
import { navigateToConversation } from '../actions/NavigationActions';
import { deleteConversation } from '../actions/ConversationActions';
import { setMainTab } from '../actions/AppActions';
import { navigateTo } from '../actions/NavigationActions';
import { triggerPermissionsDialog } from '../actions/NotificationActions';
import Style from '../style';
import ConversationList from './ConversationList';
import BaseText from './BaseText';
import PressableView from './PressableView';
import PlusButton from './PlusButton';
import SettingsButton from './SettingsButton';

const BR = "\n";

let InboxScreen = React.createClass({
  componentDidMount: function () {
    this.props.dispatch(triggerPermissionsDialog());
  },

  handleAddButtonPress: function () {
    this.props.dispatch(navigateTo('contacts'));
  },

  handelSettingsButtonPress: function () {
    this.props.dispatch(navigateTo('settings'));
  },

  render: function () {
    return (
      <View style={style.container}>
        { this.props.conversations.length ?
          this.renderConversations() : this.renderEmptyMessage() }
        <SettingsButton
          style={style.settingsButton}
          onPress={this.handelSettingsButtonPress}
        />
        <PlusButton onPress={this.handleAddButtonPress} />
      </View>
    );
  },

  renderConversations: function () {
    let conversations = this.props.conversations.map(c => ({
      ...c,
      contact: this.props.contacts[c.recipientId]
    }))
    return (
      <ConversationList
        conversations={conversations}
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
    this.props.dispatch(navigateToConversation(conversation.recipientId));
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
    backgroundColor: Style.values.backgroundGray,
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
  },
  settingsButton: {
    bottom: 82
  }
});

export default connect(inboxScreenSelector)(InboxScreen);
