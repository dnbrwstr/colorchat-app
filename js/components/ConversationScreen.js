// I've removed the PureRenderMixin from this component
// for now to make it compatible with the latest version
// of react, so there may be some performance issues.
//
import React from "react";
import createReactClass from "create-react-class";
import { View, InteractionManager, Dimensions, StatusBar } from "react-native";
import ScrollBridge from "../lib/ScrollBridge";
import { connect } from "react-redux";
import Style from "../style";
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

  shouldHideHeader: function() {
    let wH = Dimensions.get("window").height;
    let messages = this.props.messages;

    for (var h = 0, i = 0; h < wH + 100 && i < messages.length; ++i) {
      h += messages[i].height;
    }

    return h >= wH + 100;
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
          borderColor={theme.borderColor}
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
  }
});

export default withStyles(getStyles)(
  withScreenFocusStateProvider(
    connect(conversationScreenSelector)(ConversationScreen)
  )
);
