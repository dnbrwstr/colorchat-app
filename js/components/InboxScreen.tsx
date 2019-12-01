import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
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
import withStyles, {InjectedStyles, makeStyleCreator} from '../lib/withStyles';
import {withOwnFocusState, FocusState} from './ScreenFocusState';
import Style from '../style';
import {AppDispatch} from '../store/createStore';
import {Conversation} from '../store/conversations/types';
import {Contact, MatchedContact} from '../store/contacts/types';
import {User} from '../store/user/types';
import {Theme} from '../style/themes';

const BR = '\n';

interface InboxScreenProps {
  styles: InjectedStyles<typeof getStyles>;
  theme: Theme;
  screenFocusState: FocusState;
  dispatch: AppDispatch;
  conversations: Conversation[];
  contacts: {[key: string]: MatchedContact};
  user: User | null;
}

class InboxScreen extends React.Component<InboxScreenProps> {
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
          hideBackButton={true}
          onPressSettings={this.handleSettingsPressed}
          renderSettingsButton={this.renderSettingsButton}
        >
          Color Chat
        </Header>
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
          backgroundColor: this.props.user?.avatar,
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

  handleConversationSelected = (
    conversation: Conversation & {contact: Contact},
  ) => {
    this.props.dispatch(
      navigateToConversation(conversation.recipientId, conversation.contact),
    );
  };

  handleConversationDeleted = (conversation: Conversation) => {
    this.props.dispatch(deleteConversation(conversation));
  };
}

const getStyles = makeStyleCreator((theme: Theme) => ({
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

export default withOwnFocusState(
  withStyles(getStyles)(connect(inboxScreenSelector)(InboxScreen)),
);
