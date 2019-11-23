import React, {Component} from 'react';
import {View, InteractionManager, StyleProp, ViewStyle} from 'react-native';
import ScrollBridge from '../lib/ScrollBridge';
import {connect} from 'react-redux';
import Header from './Header';
import MessageList from './MessageList';
import ComposeBar from './ComposeBar';
import PlusButton from './PlusButton';
import {navigateBack, navigateTo} from '../store/navigation/actions';
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
  Message as MessageType,
  WorkingMessage,
  Message,
} from '../store/messages/types';
import {Theme} from '../style/themes';
import {FinishedMessage} from '../store/messages/types';
import {User} from '../store/user/types';
import {getContactName, getContactAvatar} from '../lib/ContactUtils';

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
  messages: MessageType[];
  totalMessages: number;
  style: StyleProp<ViewStyle>;
  styles: InjectedStyles<typeof getStyles>;
  composing: boolean;
  partnerIsComposing?: boolean;
  sending: boolean;
  cancelling: boolean;
  user: User;
  theme: Theme;
  screenFocusState: FocusState;
  recipientName?: string;
  recipientId: number;
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
    return (
      <View style={styles.container}>
        <Header
          onPressBack={() => dispatch(navigateBack())}
          onPressSettings={() => dispatch(navigateTo('conversationSettings'))}
          renderTitle={this.renderHeaderTitle}
          renderSettingsButton={this.renderSettingsButton}
        />
        <View style={[styles.messageListContainer, this.props.style]}>
          <MessageList
            scrollBridge={this.state.scrollBridge}
            onRetryMessageSend={this.handleRetryMessageSend}
            onToggleMessageExpansion={this.handleToggleMessageExpansion}
            scrollLocked={this.props.composing}
            messages={this.props.messages}
            user={this.props.user}
            onBeginningReached={this.handleBeginningReached}
            onEndReached={this.handleEndReached}
          />
          {this.props.partnerIsComposing && (
            <PlaceholderMessage style={styles.placeholderMessage} />
          )}
        </View>

        <PlusButton
          style={styles.newMessageButton}
          onPress={this.handleStartComposing}
          visible={
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
        <Text>{getContactName(contact, recipientName)}</Text>
      </View>
    );
  };

  renderSettingsButton = () => {
    const {contact, styles, theme} = this.props;
    const backgroundStyle = {
      backgroundColor: getContactAvatar(contact, theme),
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
    if (this.props.composing) return;

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

  handleToggleMessageExpansion = (message: FinishedMessage) => {
    this.props.dispatch(toggleMessageExpansion(message));
  };

  handleRetryMessageSend = (message: Message) => {
    this.props.dispatch(resendMessage(message));
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
