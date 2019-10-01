import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'ramda';
import {inboxScreenSelector} from '../store/Selectors';
import {navigateToConversation, navigateTo} from '../store/navigation/actions';
import {deleteConversation} from '../store/conversations/actions';
import {
  triggerPermissionsDialog,
  updateUnreadCount,
  checkForInitialNotification,
} from '../store/notifications/actions';
import ConversationList from './ConversationList';
import BaseText from './BaseText';
import PlusButton from './PlusButton';
import Header from './Header';
import withStyles from '../lib/withStyles';
import {withOwnFocusState} from './ScreenFocusState';
import Style from '../style';

const BR = '\n';

class InboxScreen extends React.Component {
  state = {
    initialNotificationChecked: false,
  };

  componentDidMount() {
    this.maybeCheckInitialNotification();
    this.props.dispatch(triggerPermissionsDialog());
    this.props.dispatch(updateUnreadCount());
  }

  componentDidUpdate() {
    this.maybeCheckInitialNotification();
  }

  maybeCheckInitialNotification() {
    if (
      this.props.screenFocusState !== 'focused' ||
      this.state.initialNotificationChecked
    ) {
      return;
    }

    this.props.dispatch(checkForInitialNotification());
    this.setState({
      initialNotificationChecked: true,
    });
  }

  render() {
    const {styles} = this.props;

    return (
      <View style={styles.container}>
        <Header
          title={'Color Chat'}
          onPressSettings={this.handleSettingsPressed}
          renderSettingsButton={this.renderSettingsButton}
        />
        {this.props.conversations.length
          ? this.renderConversations()
          : this.renderEmptyMessage()}
        <PlusButton onPress={this.handleAddButtonPressed} />
      </View>
    );
  }

  renderSettingsButton = () => {
    return (
      <View
        style={{
          width: Style.values.avatarSize,
          height: Style.values.avatarSize,
          backgroundColor: this.props.user.avatar,
          borderRadius: 100,
        }}
      />
    );
  };

  renderConversations = () => {
    let conversations = this.props.conversations.map(c => ({
      ...c,
      contact: this.props.contacts[c.recipientId],
    }));

    return (
      <ConversationList
        conversations={conversations}
        onSelect={this.handleConversationSelected}
        onDelete={this.handleConversationDeleted}
      />
    );
  };

  renderEmptyMessage = () => {
    const {styles} = this.props;
    return (
      <View style={styles.emptyMessageWrapper}>
        <BaseText style={styles.emptyMessage}>
          Use the plus button in the{BR}lower right to start a conversation
        </BaseText>
      </View>
    );
  };

  handleSettingsPressed = () => {
    this.props.dispatch(navigateTo('settings'));
  };

  handleAddButtonPressed = () => {
    this.props.dispatch(navigateTo('contacts'));
  };

  handleConversationSelected = conversation => {
    this.props.dispatch(navigateToConversation(conversation.recipientId));
  };

  handleConversationDeleted = conversation => {
    this.props.dispatch(deleteConversation(conversation));
  };
}

const addStyle = withStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  emptyMessageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    color: theme.secondaryTextColor,
  },
}));

export default compose(
  withOwnFocusState,
  addStyle,
  connect(inboxScreenSelector),
)(InboxScreen);
