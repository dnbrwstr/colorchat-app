import React from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Style from '../style';
import Message from './Message';

let {
  View,
  Text,
  ListView
} = React;

let compare = (comparisons, a, b) => {
  return comparisons.some(c => {
    if (typeof c === 'function') {
      return c(a) !== c(b);
    } else if (typeof c === 'string') {
      return a[c] !== b[c];
    }
  });
};

let MessageList = React.createClass({
  getInitialState: function () {
    let dataSource = new ListView.DataSource({
      rowHasChanged: (a, b) => {
        return compare([
          o => (o.clientId || o.id),
          'state',
          'width',
          'height',
          'expanded'
        ], a, b);
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
        pageSize={3}
        renderRow={this.renderMessage} />
    );
  },

  renderMessage: function (messageData, sectionId, rowId) {
    let fromCurrentUser = this.props.user.id === messageData.senderId ||
      !this.props.senderId;

    let bind = fn => fn.bind(this, messageData);

    return (
      <Message
        onToggleExpansion={bind(this.onToggleMessageExpansion)}
        onPresent={bind(this.onPresentMessage)}
        onRetrySend={bind(this.onRetryMessageSend)}
        fromCurrentUser={fromCurrentUser}
        key={messageData.id || messageData.clientId}
        { ...messageData }
      />
    );
  },

  onToggleMessageExpansion: function (message) {
    if (this.props.onToggleMessageExpansion) {
      this.props.onToggleMessageExpansion(message)
    }
  },

  onRetryMessageSend: function (message) {
    if (this.props.onRetryMessageSend) {
      this.props.onRetryMessageSend(message);
    }
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
