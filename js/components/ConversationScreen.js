import React from 'react-native';
import { connect } from 'react-redux/native';
import { createSelector } from 'reselect';
import Style from '../style';
import Header from './Header';
import MessageList from './MessageList';
import NewMessage from './NewMessage';
import { navigateBack } from '../actions/NavigationActions';
import { conversationScreenSelector } from '../lib/Selectors'

let {
  View
} = React;

let ConversationScreen = React.createClass({
  render: function () {
    let { contact, dispatch } = this.props;

    return (
      <View style={style.container}>
        <Header
          title={contact.firstName + ' ' + contact.lastName}
          showBack={true}
          onBack={() => dispatch(navigateBack())} />
          <MessageList messages={this.props.messages} />
          <NewMessage />
      </View>
    );
  }
});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  }
});

export default connect(conversationScreenSelector)(ConversationScreen);
