import React from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Style from '../style';
import Message from './Message';
import measure from '../measure';

let {
  View,
  Text,
  ListView,
  Dimensions
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

let messageHasChanged = (a, b) => {
  return compare([
    o => (o.clientId || o.id),
    'state',
    'width',
    'height',
    'expanded'
  ], a, b);
};

let getMessageData = (dataBlob, sectionId, rowId) => {
  return dataBlob[sectionId][rowId];
};

let MessageList = React.createClass({
  getInitialState: function () {
    return {
      scrollOffset: 0,
      workingData: this.getDataSource()
    };
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.messages === prevProps.messages) return;

    this.setState({
      workingData: this.getDataSource()
    });

    // Scroll to bottom when a new message is added
    if (this.props.messages.length > prevProps.messages.length) {
      this.refs.list.getScrollResponder().scrollTo(0);
    }
  },

  getDataSource: function () {
    let messages = this.getMessages();
    let messageIds = this.props.messages.map(m => m.clientId || m.id);

    let dataSource =
      (this.state && this.state.dataSource) ||
      new ListView.DataSource({
        rowHasChanged: messageHasChanged,
        getRowData: getMessageData
      });

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
        style={style.list}
        automaticallyAdjustContentInsets={false}
        renderScrollComponent={this.renderScrollComponent}
        dataSource={this.state.workingData}
        removeClippedSubviews={true}
        initialListSize={12}
        scrollRenderAheadDistance={12}
        pageSize={3}
        renderRow={this.renderMessage}
      />
    );
  },

  renderScrollComponent: function (props) {
    return (
      <InvertibleScrollView {...props}
        inverted
        ref="scrollView"
        onScroll={this.handleScroll}
        scrollEnabled={!this.props.scrollLocked}
      />
    );
  },

  renderMessage: function (messageData, sectionId, rowId) {
    let fromCurrentUser =
      this.props.user.id === messageData.senderId ||
      !messageData.senderId;

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

  handleScroll: function (e) {
    if (this.props.scrollBridge) this.props.scrollBridge.handleScroll(e);
  },

  onToggleMessageExpansion: async function (message, position, nextSize) {
    if (this.props.onToggleMessageExpansion) {
      this.props.onToggleMessageExpansion(message)
    }

    // Return if the message is closing
    if (message.expanded) return;

    /**
     * Note that top and bottom are flipped here
     * as we're using an InvertibleScrollView
     */
    let { height, width } = Dimensions.get('window');
    let nextTop = position.top + position.height - nextSize.height;
    let nextOffset = nextTop - Style.values.rowHeight;

    if (nextOffset < 0) {
      this.refs.list.getScrollResponder().scrollTo(this.state.scrollOffset - nextOffset);
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
  },
  list: {
    overflow: 'hidden'
  }
});

export default MessageList;
