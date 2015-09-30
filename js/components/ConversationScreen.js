import React from 'react-native';
import { connect } from 'react-redux/native';
import { merge } from 'ramda';
import { createSelector } from 'reselect';
import Style from '../style';
import Header from './Header';
import PressableView from './PressableView';
import MessageList from './MessageList';
import ComposeBar from './ComposeBar';
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
  sendWorkingMessage,
  markMessageStale,
  startComposingMessage,
  cancelComposingMessage
} = MessageActions;

let ConversationScreen = React.createClass({
  render: function () {
    let { contact, dispatch } = this.props;

    let name = [contact.firstName, contact.lastName]
      .filter(n => !!n).join(' ');

    return (
      <View style={style.container}>
        <Header
          title={name}
          showBack={true}
          backgroundColor={Style.values.darkGray}
          highlightColor={Style.values.darkGrayHighlight}
          onBack={() => dispatch(navigateTo('main'))}
        />
        <MessageList
          scrollLocked={this.props.composing}
          onPresentMessage={this.onPresentMessage}
          messages={this.props.messages}
          user={this.props.user}
        />
        <ComposeBar
          ref="composeBar"
          active={this.props.composing}
          onSend={this.onSendMessage}
          onCancel={this.onStopComposing}
        />

        { !this.props.composing && !this.props.sending &&
          <PressableView
            style={style.newMessageButton}
            onPress={this.onStartComposing}
          >
            <Text style={style.newMessageButtonText}>+</Text>
          </PressableView> }
      </View>
    );
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

  onPresentMessage: function (message) {
    this.props.dispatch(markMessageStale(message));
  }
});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  newMessageButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Style.values.darkGray,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  newMessageButtonText: {
    color: 'white',
    fontSize: 24,
    marginTop: -4
  }
});

export default connect(conversationScreenSelector)(ConversationScreen);
