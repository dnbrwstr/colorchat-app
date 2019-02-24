import React from "react";
import createReactClass from "create-react-class";
import { FlatList, Dimensions, ScrollView } from "react-native";
import Style from "../style";
import Message from "./Message";
import TimerMixin from "./mixins/TimerMixin";

let BEGINNING_REACHED_OFFSET = 1000;

let compare = (comparisons, a, b) => {
  return comparisons.some(c => {
    if (typeof c === "function") {
      return c(a) !== c(b);
    } else if (typeof c === "string") {
      return a[c] !== b[c];
    }
  });
};

let messageHasChanged = (a, b) => {
  return compare(
    [o => o.clientId || o.id, "state", "width", "height", "expanded", "color"],
    a,
    b
  );
};

let getMessageData = (dataBlob, sectionId, rowId) => {
  return dataBlob[sectionId][rowId];
};

let getMessageKey = message => message.id || message.state;

let MessageList = createReactClass({
  displayName: "MessageList",
  mixins: [TimerMixin],

  getDefaultProps: function() {
    return {
      onToggleMessageExpansion: () => {},
      onRetrySend: () => {},
      onPresentMessage: () => {},
      onBeginningReached: () => {},
      onEndReached: () => {}
    };
  },

  getInitialState: function() {
    return {
      scrollOffset: 0
    };
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return (
      this.props.messages !== nextProps.messages ||
      this.props.scrollLocked !== nextProps.scrollLocked ||
      this.props.user.id !== nextProps.user.id
    );
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.messages === nextProps.messages) return;

    if (!this.props.messages.length || !nextProps.messages.length) return;

    // Scroll to bottom when a new message is added
    let composeStarted =
      this.props.messages[0].state !== "composing" &&
      nextProps.messages[0].state === "composing";

    if (composeStarted) {
      this.refs.list.getScrollResponder().scrollTo({ y: 0 });
    }
  },

  formatMessages: function(messages) {
    return messages.reduce((memo, m) => {
      memo[m.clientId || m.id] = m;
      return memo;
    }, {});
  },

  render: function() {
    return (
      <FlatList
        ref="list"
        style={style.list}
        data={this.props.messages}
        keyExtractor={getMessageKey}
        inverted={true}
        initialNumToRender={16}
        maxToRenderPerBatch={16}
        pageSize={1}
        renderItem={this.renderMessage}
        renderScrollComponent={this.renderScrollComponent}
        onEndReached={this.props.onEndReached}
      />
    );
  },

  renderScrollComponent: function(props) {
    let onScroll = e => {
      props.onScroll(e), this.handleScroll(e);
    };

    return (
      <ScrollView
        {...props}
        onScroll={onScroll}
        scrollEnabled={!this.props.scrollLocked}
      />
    );
  },

  renderMessage: function({ index, item }) {
    let fromCurrentUser =
      this.props.user.id === item.senderId || !item.senderId;

    let bind = fn => fn.bind(this, item);

    return (
      <Message
        onToggleExpansion={bind(this.onToggleMessageExpansion)}
        onPresent={bind(this.onPresentMessage)}
        onRetrySend={bind(this.onRetryMessageSend)}
        fromCurrentUser={fromCurrentUser}
        message={item}
        {...item}
      />
    );
  },

  handleScroll: function(e) {
    let scrollOffset = e.nativeEvent.contentOffset.y;

    if (
      scrollOffset < BEGINNING_REACHED_OFFSET &&
      this.state.scrollOffset >= BEGINNING_REACHED_OFFSET
    ) {
      this.setThrottleTimer(
        "beginningReached",
        this.props.onBeginningReached,
        1000
      );
    }

    this.setState({ scrollOffset });

    if (this.props.scrollBridge) this.props.scrollBridge.handleScroll(e);
  },

  onToggleMessageExpansion: async function(message, position, nextSize) {
    // Don't expand message if scroll is locked
    if (this.props.scrollLocked) return;

    this.props.onToggleMessageExpansion(message);

    // Return if the message is closing
    if (message.expanded) return;

    // Note that top and bottom are flipped here
    // as we're using an InvertibleScrollView
    let { height, width } = Dimensions.get("window");
    let nextTop = position.top + position.height - nextSize.height;
    let nextOffset = nextTop - Style.values.rowHeight;

    if (nextOffset < 0) {
      this.refs.list
        .getScrollResponder()
        .scrollTo({ y: this.state.scrollOffset - nextOffset });
    }
  },

  onRetryMessageSend: function(message) {
    this.props.onRetryMessageSend(message);
  },

  onPresentMessage: function(message) {
    this.props.onPresentMessage(message);
  }
});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: "fuchsia"
  },
  list: {
    overflow: "hidden"
  }
});

export default MessageList;
