import React from 'react-native';
import { connect } from 'react-redux/native';
import { merge } from 'ramda';
import { createSelector } from 'reselect';
import Style from '../style';
import Header from './Header';
import MessageList from './MessageList';
import NewMessage from './NewMessage';
import { navigateBack } from '../actions/NavigationActions';
import { sendMessage, markMessageStale } from '../actions/MessageActions';
import { conversationScreenSelector } from '../lib/Selectors'
import * as AppActions from '../actions/AppActions';

let {
  View
} = React;

let {
  startComposingMessage,
  stopComposingMessage,
  selectColorPicker
} = AppActions;

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
          onBack={() => dispatch(navigateBack())}
        />
          <MessageList
            onPresentMessage={this.onPresentMessage}
            messages={this.props.messages}
            user={this.props.user}
          />
          <NewMessage
            onSendMessage={this.onSendMessage}
            onStartComposing={this.onStartComposing}
            onStopComposing={this.onStopComposing}
            onSelectPicker={this.onSelectPicker}
            colorPicker={this.props.colorPicker}
            composing={this.props.composing}
          />
      </View>
    );
  },

  onSendMessage: function (message) {
    let finalMessage = merge(message, {
      recipientId: this.props.contact.id
    });

    this.props.dispatch(sendMessage(finalMessage));
  },

  onStartComposing: function () {
    this.props.dispatch(startComposingMessage());
  },

  onStopComposing: function () {
    this.props.dispatch(stopComposingMessage());
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
  }
});

export default connect(conversationScreenSelector)(ConversationScreen);
