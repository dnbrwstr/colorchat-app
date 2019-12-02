import React, {Component, useState, useCallback} from 'react';
import {View, InteractionManager, StyleProp, ViewStyle} from 'react-native';
import ScrollBridge from '../lib/ScrollBridge';
import {connect} from 'react-redux';
import Header from './Header';
import MessageList from './MessageList';
import ComposeBar from './ComposeBar';
import PlusButton from './PlusButton';
import {navigateTo} from '../store/navigation/actions';
import * as MessageActions from '../store/messages/actions';
import {conversationScreenSelector} from '../store/Selectors';
import {updateConversationUi} from '../store/ui/actions';
import {withScreenFocusStateProvider, FocusState} from './ScreenFocusState';
import withStyles, {InjectedStyles, makeStyleCreator} from '../lib/withStyles';
import {updateUnreadCount} from '../store/notifications/actions';
import {markConversationRead} from '../store/conversations/actions';
import PlaceholderMessage from './PlaceholderMessage';
import Style from '../style';
import Text from './BaseText';
import {AppDispatch} from '../store/createStore';
import {MatchedContact} from '../store/contacts/types';
import {
  Message as MessageData,
  WorkingMessage,
  Message,
  MessageType,
} from '../store/messages/types';
import {Theme} from '../style/themes';
import {FinishedMessage} from '../store/messages/types';
import {User} from '../store/user/types';
import {getContactAvatar} from '../lib/ContactUtils';

const {
  resendMessage,
  sendWorkingMessage,
  startComposingMessage,
  cancelComposingMessage,
  destroyWorkingMessage,
  toggleMessageExpansion,
  loadMessages,
  unloadOldMessages,
} = MessageActions;

interface ConversationScreenProps {
  contact?: MatchedContact;
  dispatch: AppDispatch;
  messages: MessageData[];
  totalMessages: number;
  style: StyleProp<ViewStyle>;
  styles: InjectedStyles<typeof getStyles>;
  composing: boolean;
  partnerIsComposing?: boolean;
  sending: boolean;
  cancelling: boolean;
  user: User | null;
  theme: Theme;
  screenFocusState: FocusState;
  recipientName?: string;
  recipientAvatar?: string;
  recipientId: number;
  hasExpandedMessages: boolean;
}

interface ConversationScreenState {
  page: number;
  loadedAll: boolean;
  scrollBridge: ScrollBridge;
  lastOffset: number;
}

export class ConversationScreen extends Component<
  ConversationScreenProps,
  ConversationScreenState
> {
  state = {
    page: 0,
    loadedAll: false,
    scrollBridge: new ScrollBridge(),
    lastOffset: 0,
  };

  componentDidMount() {
    this.props.dispatch(markConversationRead(this.props.recipientId));
    this.props.dispatch(updateUnreadCount());
  }

  static getDerivedStateFromProps = (props: ConversationScreenProps) => {
    return {
      loadedAll: props.messages && props.messages.length >= props.totalMessages,
    };
  };

  render() {
    const {dispatch, styles} = this.props;
    if (!this.props.user) return null;
    return (
      <View style={styles.container}>
        <Header
          onPressSettings={() => dispatch(navigateTo('conversationSettings'))}
          renderTitle={this.renderHeaderTitle}
          renderSettingsButton={this.renderSettingsButton}
        />
        <View style={[styles.messageListContainer, this.props.style]}>
          <MessageList
            scrollBridge={this.state.scrollBridge}
            onRetryMessageSend={this.handleRetryMessageSend}
            onMessageExpanded={this.handleMessageExpanded}
            onMessageCollapsed={this.handleMessageCollapsed}
            scrollLocked={this.props.composing}
            messageExpanded={this.props.hasExpandedMessages}
            messages={this.props.messages}
            user={this.props.user}
            onBeginningReached={this.handleBeginningReached}
            onEndReached={this.handleEndReached}
            onMessageEchoed={this.handleMessageEchoed}
          />
          {this.props.partnerIsComposing && (
            <PlaceholderMessage style={styles.placeholderMessage} />
          )}
        </View>

        <PlusButton
          style={styles.newMessageButton}
          onPress={this.handleStartComposing}
          visible={
            !this.props.hasExpandedMessages &&
            !this.props.composing &&
            !this.props.sending &&
            !this.props.cancelling
          }
        />
        <ComposeBar
          active={this.props.composing}
          onSend={this.handleSendMessage}
          onCancel={this.handleStopComposing}
          onPressCamera={this.handlePressCameraButton}
        />
      </View>
    );
  }

  renderHeaderTitle = () => {
    const {contact, styles, recipientName} = this.props;
    return (
      <View style={styles.headerTitle}>
        <Text>{recipientName}</Text>
      </View>
    );
  };

  renderSettingsButton = () => {
    const {contact, styles, theme} = this.props;
    const backgroundStyle = {
      backgroundColor: getContactAvatar(
        contact,
        this.props.recipientAvatar,
        theme,
      ),
    };
    const settingsStyles = [styles.settingsButton, backgroundStyle];
    return <View style={settingsStyles} />;
  };

  handleEndReached = () => {
    if (this.state.loadedAll) return;
    let nextPage = ++this.state.page;
    this.props.dispatch(loadMessages(this.props.recipientId, this.state.page));
    this.setState({page: nextPage});
  };

  handleBeginningReached = () => {
    this.setState({
      page: 2,
      loadedAll: false,
    });
    this.props.dispatch(unloadOldMessages());
  };

  handlePressCameraButton = () => {
    this.props.dispatch(navigateTo('camera'));
  };

  handleSendMessage = () => {
    if (this.props.sending) return;
    if (!this.getWorkingMessage()) return;

    this.props.dispatch(
      updateConversationUi({
        sending: true,
        composing: false,
      }),
    );

    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.props.dispatch(sendWorkingMessage(this.getWorkingMessage()));

        setTimeout(() => {
          InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(
              updateConversationUi({
                sending: false,
              }),
            );
          });
        }, 0);
      });
    }, 0);
  };

  handleStartComposing = () => {
    console.log('maybe start composing');
    if (this.props.composing) return;
    console.log('really start composing');

    this.props.dispatch(
      startComposingMessage({
        recipientId: this.props.recipientId,
      }),
    );
  };

  handleStopComposing = () => {
    // InteractionManager.setDeadline(1000);
    this.props.dispatch(cancelComposingMessage(this.getWorkingMessage()));
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.props.dispatch(destroyWorkingMessage(this.getWorkingMessage()));
        setTimeout(() => {
          InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(
              updateConversationUi({
                cancelling: false,
              }),
            );
          });
        }, 0);
      });
    }, 1000);
  };

  handleMessageExpanded = (message: FinishedMessage) => {
    if (this.props.hasExpandedMessages) return;
    this.props.dispatch(toggleMessageExpansion(message, true));
  };

  handleMessageCollapsed = (message: FinishedMessage) => {
    this.props.dispatch(toggleMessageExpansion(message, false));
  };

  handleRetryMessageSend = (message: Message) => {
    this.props.dispatch(resendMessage(message));
  };

  handleMessageEchoed = (message: FinishedMessage) => {
    if (this.props.composing) return;
    const userId = this.props.user?.id;
    const recipientId = message.recipientId;
    const isPartnerEcho = userId === recipientId;
    this.props.dispatch(toggleMessageExpansion(message, false));
    this.props.dispatch(
      startComposingMessage({
        recipientId: this.props.recipientId,
        color: message.color,
        type: MessageType.Echo,
        echoType: isPartnerEcho ? 'partner' : 'self',
        width: message.width,
        height: message.height,
      }),
    );
  };

  getWorkingMessage = (): WorkingMessage => {
    return this.props.messages.filter(
      m => m.state === 'working' || m.state === 'cancelling',
    )[0] as WorkingMessage;
  };
}

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  messageListContainer: {
    flex: 1,
  },
  newMessageButton: {
    backgroundColor: theme.primaryButtonColor,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  placeholderMessage: {
    position: 'absolute',
    bottom: Style.values.outerPadding,
    left: Style.values.outerPadding,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    borderRadius: 100,
    width: Style.values.avatarSize,
    height: Style.values.avatarSize,
  },
}));

const addStyles = withStyles(getStyles);

export default withScreenFocusStateProvider(
  addStyles(connect(conversationScreenSelector)(ConversationScreen)),
);
