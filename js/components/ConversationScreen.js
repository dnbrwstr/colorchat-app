import React from 'react-native';
import { connect } from 'react-redux/native';
import { merge } from 'ramda';
import { createSelector } from 'reselect';
import Style from '../style';
import Header from './Header';
import StickyView from './StickyView';
import PressableView from './PressableView';
import MessageList from './MessageList';
import ComposeBar from './ComposeBar';
import NewMessageButton from './NewMessageButton';
import { navigateTo } from '../actions/NavigationActions';
import * as MessageActions from '../actions/MessageActions';
import { conversationScreenSelector } from '../lib/Selectors';
import { updateConversationUi } from '../actions/AppActions';

let {
  View,
  Text,
  InteractionManager
} = React;

let {
  sendMessage,
  sendWorkingMessage,
  markMessageStale,
  startComposingMessage,
  cancelComposingMessage,
  toggleMessageExpansion
} = MessageActions;

let ConversationScreen = React.createClass({
  getInitialState: function () {
    return {
      messageListScrollOffset: null
    };
  },

  render: function () {
    let { contact, dispatch } = this.props;

    let name = [contact.firstName, contact.lastName]
      .filter(n => !!n).join(' ');

    return (
      <View style={style.container}>
        <MessageList
          onScroll={this.handleMessageListScroll}
          onPresentMessage={this.onPresentMessage}
          onRetryMessageSend={this.onRetryMessageSend}
          onToggleMessageExpansion={this.onToggleMessageExpansion}
          scrollLocked={this.props.composing}
          messages={this.props.messages}
          user={this.props.user}
        />
        <ComposeBar
          ref="composeBar"
          active={this.props.composing}
          onSend={this.onSendMessage}
          onCancel={this.onStopComposing}
        />
        <NewMessageButton
          onPress={this.onStartComposing}
          visible={!this.props.composing && !this.props.sending}
        />
        <StickyView
          autoHide={true}
          scrollViewOffset={this.state.messageListScrollOffset}
        >
          <Header
            title={name}
            showBack={true}
            color="white"
            backgroundColor={'rgba(0,0,0,.8)'}
            highlightColor={Style.values.darkGrayHighlight}
            onBack={() => dispatch(navigateTo('main'))}
          />
        </StickyView>
      </View>
    );
  },

  handleMessageListScroll: function (e) {
    this.setState({
      messageListScrollOffset: e.nativeEvent.contentOffset
    });
  },

  onSendMessage: function (message) {
    if (this.props.sending) return;

    this.props.dispatch(updateConversationUi({
      sending: true,
      composing: false
    }));

    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.props.dispatch(sendWorkingMessage());

        setTimeout(() => {
          InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(updateConversationUi({
              sending: false
            }));
          });
        }, 0);
      });
    }, 0);
  },

  onStartComposing: function () {
    this.props.dispatch(startComposingMessage({
      recipientId: this.props.contact.id,
    }));
  },

  onStopComposing: function () {
    this.props.dispatch(cancelComposingMessage());
  },

  onSelectPicker: function (value) {
    this.props.dispatch(selectColorPicker(value));
  },

  onToggleMessageExpansion: function (message) {
    this.props.dispatch(toggleMessageExpansion(message));
  },

  onRetryMessageSend: function (message) {
    this.props.dispatch(sendMessage(message));
  },

  onPresentMessage: function (message) {
    this.props.dispatch(markMessageStale(message));
  },

});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  }
});

export default connect(conversationScreenSelector)(ConversationScreen);
