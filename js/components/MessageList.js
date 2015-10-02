import React from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Style from '../style';
import Message from './Message';

let {
  View,
  Text,
  ListView
} = React;

let MessageList = React.createClass({
  getInitialState: function () {
    let dataSource = new ListView.DataSource({
      rowHasChanged: (a, b) => {
        return (a.clientId || a.id) !== (b.clientId || b.id) ||
          (a.id !== b.id);
      },
      getRowData: (dataBlob, sectionId, rowId) => {
        return dataBlob[sectionId][rowId];
      }
    });

    return {
      workingData: this.cloneWithMessageData(dataSource)
    };
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.messages === prevProps.messages) return;

    this.setState({
      workingData: this.cloneWithMessageData(this.state.workingData)
    });

    if (this.props.messages.length > prevProps.messages.length) {
      this.refs.list.getScrollResponder().scrollTo(0);
    }
  },

  cloneWithMessageData: function (dataSource) {
    let messages = this.getMessages();
    let messageIds = this.props.messages.map(m => m.clientId || m.id);
    return dataSource.cloneWithRows(messages, messageIds);
  },

  getMessages: function () {
    return this.props.messages.reduce((memo, m) => {
      memo[m.clientId || m.id] = m;
      return memo;
    }, {});
  },

  render: function () {
    return (
      <ListView
        ref="list"
        style={{overflow: 'hidden'}}
        automaticallyAdjustContentInsets={false}
        renderScrollComponent={ props => {
          return (
            <InvertibleScrollView {...props}
              inverted
              ref="scrollView"
              scrollEnabled={!this.props.scrollLocked}
            />
          );
        }}
        dataSource={this.state.workingData}
        removeClippedSubviews={true}
        initialListSize={12}
        scrollRenderAheadDistance={12}
        pageSize={2}
        renderRow={this.renderMessage} />
    );
  },

  renderMessage: function (messageData, sectionId, rowId) {
    let fromCurrentUser = this.props.user.id === messageData.senderId;

    return (
      <Message
        onPresent={this.onPresentMessage.bind(this, messageData)}
        fromCurrentUser={fromCurrentUser}
        key={messageData.id || messageData.clientId}
        { ...messageData } />
    );
  },

  onPresentMessage: function (message) {
    if (this.props.onPresentMessage) {
      this.props.onPresentMessage(message)
    }
  }
});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'fuchsia'
  }
});

export default MessageList;
