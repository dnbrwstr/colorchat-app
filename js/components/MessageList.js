import React from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Style from '../style';
import Message from './Message';
import measure from '../measure';
import TimerMixin from './mixins/TimerMixin';

let {
  View,
  Text,
  ListView,
  Dimensions
} = React;

let BEGINNING_REACHED_OFFSET = 1000;

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
    'expanded',
    'color'
  ], a, b);
};

let getMessageData = (dataBlob, sectionId, rowId) => {
  return dataBlob[sectionId][rowId];
};

let MessageList = React.createClass({
  mixins: [TimerMixin],

  getDefaultProps: function () {
    return {
      onToggleMessageExpansion: () => {},
      onRetrySend: () => {},
      onPresentMessage: () => {},
      onBeginningReached: () => {},
      onEndReached: () => {}
    };
  },

  getInitialState: function () {
    return {
      scrollOffset: 0,
      workingData: this.getDataSource(this.props.messages)
    };
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.messages !== nextProps.messages ||
      this.props.scrollLocked !== nextProps.scrollLocked ||
      this.props.user.id !== nextProps.user.id ||
      this.state.workingData !== nextState.workingData;
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.messages === nextProps.messages) return;

    this.setState({
      workingData: this.getDataSource(nextProps.messages)
    });

    if (!this.props.messages.length || !nextProps.messages.length) return;

    // Scroll to bottom when a new message is added
    let composeStarted =
      this.props.messages[0].state !== 'composing' &&
      nextProps.messages[0].state === 'composing';

    if (composeStarted) {
      this.refs.list.getScrollResponder().scrollTo(0);
    }
  },

  getDataSource: function (_messages) {
    let messages = this.formatMessages(_messages);
    let messageIds = _messages.map(m => m.clientId || m.id);

    let dataSource =
      (this.state && this.state.workingData) ||
      new ListView.DataSource({
        rowHasChanged: messageHasChanged,
        getRowData: getMessageData
      });

    return dataSource.cloneWithRows(messages, messageIds);
  },

  formatMessages: function (messages) {
    return messages.reduce((memo, m) => {
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
        pageSize={1}
        renderRow={this.renderMessage}
        onEndReached={this.props.onEndReached}
      />
    );
  },

  renderScrollComponent: function (props) {
    let onScroll = e => {
      props.onScroll(e),
      this.handleScroll(e)
    };

    return (
      <InvertibleScrollView {...props}
        inverted
        onScroll={onScroll}
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
        message={messageData}
        { ...messageData }
      />
    );
  },

  handleScroll: function (e) {
    let scrollOffset = e.nativeEvent.contentOffset.y;

    if (scrollOffset < BEGINNING_REACHED_OFFSET &&
        this.state.scrollOffset >= BEGINNING_REACHED_OFFSET) {
      this.setThrottleTimer('beginningReached', this.props.onBeginningReached, 1000);
    }

    this.setState({ scrollOffset });

    if (this.props.scrollBridge) this.props.scrollBridge.handleScroll(e);
  },

  onToggleMessageExpansion: async function (message, position, nextSize) {
    // Don't expand message if scroll is locked
    if (this.props.scrollLocked) return;

    this.props.onToggleMessageExpansion(message);

    // Return if the message is closing
    if (message.expanded) return;

    // Note that top and bottom are flipped here
    // as we're using an InvertibleScrollView
    let { height, width } = Dimensions.get('window');
    let nextTop = position.top + position.height - nextSize.height;
    let nextOffset = nextTop - Style.values.rowHeight;

    if (nextOffset < 0) {
      this.refs.list.getScrollResponder().scrollTo(this.state.scrollOffset - nextOffset);
    }
  },

  onRetryMessageSend: function (message) {
    this.props.onRetryMessageSend(message);
  },

  onPresentMessage: function (message) {
    this.props.onPresentMessage(message)
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
