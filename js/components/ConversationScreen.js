import React, {Component} from 'react';
import {View} from 'react-native';
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
import {withScreenFocusStateProvider} from './ScreenFocusState';
import withStyles from '../lib/withStyles';
import {updateUnreadCount} from '../store/notifications/actions';
import {markConversationRead} from '../store/conversations/actions';
import PlaceholderMessage from './PlaceholderMessage';
import Style from '../style';
import Text from './BaseText';

let {
  resendMessage,
  sendWorkingMessage,
  startComposingMessage,
  cancelComposingMessage,
  destroyWorkingMessage,
  toggleMessageExpansion,
  loadMessages,
  unloadOldMessages,
} = MessageActions;

export class ConversationScreen extends Component {
  state = {
    page: 0,
    loadedAll: false,
    scrollBridge: new ScrollBridge(),
    lastOffset: 0,
  };

  componentDidMount() {
    this.props.dispatch(markConversationRead(this.props.contact.id));
    this.props.dispatch(updateUnreadCount());
  }

  static getDerivedStateFromProps = props => {
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
            removeClippedSubviews={true}
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
    const {contact, styles} = this.props;
    return (
      <View style={styles.headerTitle}>
        <Text>{contact.name}</Text>
      </View>
    );
  };

  renderSettingsButton = () => {
    const {contact, styles} = this.props;
    const backgroundStyle = {backgroundColor: contact.avatar || '#CCC'};
    const settingsStyles = [styles.settingsButton, backgroundStyle];
    return <View style={settingsStyles} />;
  };

  handleEndReached = () => {
    if (this.state.loadedAll) return;
    let nextPage = ++this.state.page;
    this.props.dispatch(loadMessages(this.props.contact.id, this.state.page));
    this.setState({page: nextPage});
  };

  handleBeginningReached = () => {
    this.props.dispatch(unloadOldMessages());
  };

  handlePressCameraButton = () => {
    this.props.dispatch(navigateTo('camera'));
  };

  handleSendMessage = message => {
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
        recipientId: this.props.contact.id,
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

  handleToggleMessageExpansion = message => {
    this.props.dispatch(toggleMessageExpansion(message));
  };

  handleRetryMessageSend = message => {
    this.props.dispatch(resendMessage(message));
  };

  getWorkingMessage = () => {
    return this.props.messages.filter(
      m => m.state === 'composing' || m.state === 'cancelling',
    )[0];
  };
}

const addStyle = withStyles(theme => ({
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
  setingsButton: {
    borderRadius: 100,
    width: Style.values.avatarSize,
    height: Style.values.avatarSize,
  },
}));

export default withScreenFocusStateProvider(
  addStyle(connect(conversationScreenSelector)(ConversationScreen)),
);
