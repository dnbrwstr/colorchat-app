import React, { PureComponent } from "react";
import createReactClass from "create-react-class";
import { View, InteractionManager, Dimensions, StatusBar } from "react-native";
import ScrollBridge from "../lib/ScrollBridge";
import { connect } from "react-redux";
import Header from "./Header";
import MessageList from "./MessageList";
import ComposeBar from "./ComposeBar";
import PlusButton from "./PlusButton";
import { navigateBack } from "../actions/NavigationActions";
import * as MessageActions from "../actions/MessageActions";
import { conversationScreenSelector } from "../lib/Selectors";
import { updateConversationUi } from "../actions/AppActions";
import TimerMixin from "./mixins/TimerMixin";
import { withScreenFocusStateProvider } from "./ScreenFocusState";
import withStyles from "../lib/withStyles";
import { updateUnreadCount } from "../actions/NotificationActions";

let {
  resendMessage,
  sendWorkingMessage,
  markMessageStale,
  startComposingMessage,
  cancelComposingMessage,
  destroyWorkingMessage,
  toggleMessageExpansion,
  loadMessages,
  unloadOldMessages
} = MessageActions;

let ConversationScreen = createReactClass({
  displayName: "ConversationScreen",
  mixins: [TimerMixin],

  getInitialState: function() {
    return {
      page: 0,
      loadedAll: false,
      scrollBridge: new ScrollBridge(),
      lastOffset: 0
    };
  },

  componentDidMount: function() {
    this.props.dispatch(updateUnreadCount());
  },

  componentWillUnmount: function() {
    this.clearAllTimers();
  },

  loadNextPage: function() {
    this.setThrottleTimer(
      "loadNext",
      () => {
        let nextPage = ++this.state.page;
        this.props.dispatch(
          loadMessages(this.props.contact.id, this.state.page)
        );
        this.setState({ page: nextPage });
      },
      1000
    );
  },

  render: function() {
    const { contact, dispatch, styles, theme } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title={contact.name}
          showBack={true}
          backgroundColor={theme.backgroundColor}
          highlightColor={theme.highlightColor}
          borderColor={theme.secondaryBorderColor}
          onBack={() => dispatch(navigateBack())}
        />
        <MessageList
          scrollBridge={this.state.scrollBridge}
          onPresentMessage={this.onPresentMessage}
          onRetryMessageSend={this.onRetryMessageSend}
          onToggleMessageExpansion={this.onToggleMessageExpansion}
          scrollLocked={this.props.composing}
          messages={this.props.messages}
          user={this.props.user}
          onBeginningReached={this.handleScrollToBottom}
          onEndReached={this.loadNextPage}
        />
        <PlusButton
          style={styles.newMessageButton}
          onPress={this.onStartComposing}
          visible={
            !this.props.composing &&
            !this.props.sending &&
            !this.props.cancelling
          }
        />
        <ComposeBar
          ref="composeBar"
          active={this.props.composing}
          onSend={this.onSendMessage}
          onCancel={this.onStopComposing}
        />
      </View>
    );
  },

  handleScrollToBottom: function() {
    this.props.dispatch(unloadOldMessages());
  },

  onSendMessage: function(message) {
    if (this.props.sending) return;

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
  },

  onStartComposing: function() {
    this.props.dispatch(
      startComposingMessage({
        recipientId: this.props.contact.id
      })
    );
  },

  onStopComposing: function() {
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
    }, 0);
  },

  getWorkingMessage: function() {
    return this.props.messages.filter(
      m => m.state === "composing" || m.state === "cancelling"
    )[0];
  },

  onSelectPicker: function(value) {
    this.props.dispatch(selectColorPicker(value));
  },

  onToggleMessageExpansion: function(message) {
    this.props.dispatch(toggleMessageExpansion(message));
  },

  onRetryMessageSend: function(message) {
    this.props.dispatch(resendMessage(message));
  },

  onPresentMessage: function(message) {
    this.props.dispatch(markMessageStale(message));
  }
});

const getStyles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  newMessageButton: {
    backgroundColor: theme.primaryButtonColor
  }
});

export default withStyles(getStyles)(
  withScreenFocusStateProvider(
    connect(conversationScreenSelector)(ConversationScreen)
  )
);
