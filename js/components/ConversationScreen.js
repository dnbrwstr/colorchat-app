import React, { Component, PureComponent } from "react";
import { View, InteractionManager, Dimensions, StatusBar } from "react-native";
import ScrollBridge from "../lib/ScrollBridge";
import { connect } from "react-redux";
import Header from "./Header";
import MessageList from "./MessageList";
import ComposeBar from "./ComposeBar";
import PlusButton from "./PlusButton";
import { navigateBack, navigateTo } from "../actions/NavigationActions";
import * as MessageActions from "../actions/MessageActions";
import { conversationScreenSelector } from "../lib/Selectors";
import { updateConversationUi } from "../actions/AppActions";
import { withScreenFocusStateProvider } from "./ScreenFocusState";
import withStyles from "../lib/withStyles";
import { updateUnreadCount } from "../actions/NotificationActions";
import { markConversationRead } from "../actions/ConversationActions";
import PlaceholderMessage from "./PlaceholderMessage";
import Style from "../style";
import Text from "./BaseText";

let {
  resendMessage,
  sendWorkingMessage,
  startComposingMessage,
  cancelComposingMessage,
  destroyWorkingMessage,
  toggleMessageExpansion,
  loadMessages,
  unloadOldMessages
} = MessageActions;

class ConversationScreen extends Component {
  state = {
    page: 0,
    loadedAll: false,
    scrollBridge: new ScrollBridge(),
    lastOffset: 0
  };

  componentDidMount() {
    this.props.dispatch(markConversationRead(this.props.contact.id));
    this.props.dispatch(updateUnreadCount());
  }

  static getDerivedStateFromProps = props => {
    return {
      loadedAll: props.messages && props.messages.length >= props.totalMessages
    };
  };

  render() {
    const { dispatch, styles, theme } = this.props;
    return (
      <View style={styles.container}>
        <Header
          renderTitle={this.renderHeaderTitle}
          onPressBack={() => dispatch(navigateBack())}
          onPressSettings={() => dispatch(navigateTo("conversationSettings"))}
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
          ref="composeBar"
          active={this.props.composing}
          onSend={this.handleSendMessage}
          onCancel={this.handleStopComposing}
          onPressCamera={this.handlePressCameraButton}
        />
      </View>
    );
  }

  renderHeaderTitle = () => {
    const { contact, user } = this.props;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            backgroundColor: contact.avatar,
            borderRadius: 100,
            width: Style.values.avatarSize,
            height: Style.values.avatarSize,
            marginRight: 12
          }}
        />
        <Text>{contact.name}</Text>
      </View>
    );
  };

  renderSettingsButton = () => {
    const { styles, theme } = this.props;
    return (
      <View
        style={{
          width: 25,
          height: 25,
          borderRadius: 100,
          backgroundColor: theme.primaryTextColor,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text style={{ color: theme.backgroundColor }}>i</Text>
      </View>
    );
  };

  handleEndReached = () => {
    if (this.state.loadedAll) return;
    let nextPage = ++this.state.page;
    this.props.dispatch(loadMessages(this.props.contact.id, this.state.page));
    this.setState({ page: nextPage });
  };

  handleBeginningReached = () => {
    this.props.dispatch(unloadOldMessages());
  };

  handlePressCameraButton = () => {
    this.props.dispatch(navigateTo("camera"));
  };

  handleSendMessage = message => {
    if (this.props.sending) return;
    if (!this.getWorkingMessage()) return;

    this.props.dispatch(
      updateConversationUi({
        sending: true,
        composing: false
      })
    );

    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.props.dispatch(sendWorkingMessage(this.getWorkingMessage()));

        setTimeout(() => {
          InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(
              updateConversationUi({
                sending: false
              })
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
        recipientId: this.props.contact.id
      })
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
                cancelling: false
              })
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
      m => m.state === "composing" || m.state === "cancelling"
    )[0];
  };
}

const addStyle = withStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  messageListContainer: {
    flex: 1
  },
  newMessageButton: {
    backgroundColor: theme.primaryButtonColor
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    left: 0
  },
  placeholderMessage: {
    position: "absolute",
    bottom: Style.values.outerPadding,
    left: Style.values.outerPadding
  }
}));

export default withScreenFocusStateProvider(
  addStyle(connect(conversationScreenSelector)(ConversationScreen))
);
