import React, { Component } from "react";
import { FlatList, Dimensions, ScrollView, View } from "react-native";
import Style from "../style";
import Message from "./Message";
import { getStatusBarHeight } from "react-native-iphone-x-helper";

let BEGINNING_REACHED_OFFSET = 1000;

let getMessageKey = message => {
  const key = message.id || message.clientId || message.state;
  return key.toString();
};

class MessageList extends Component {
  static defaultProps = () => ({
    onToggleMessageExpansion: () => {},
    onRetrySend: () => {},
    onBeginningReached: () => {},
    onEndReached: () => {}
  });

  state = {
    scrollOffset: 0
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.messages !== nextProps.messages ||
      this.props.scrollLocked !== nextProps.scrollLocked ||
      this.props.user.id !== nextProps.user.id
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages === nextProps.messages) return;

    if (!this.props.messages.length || !nextProps.messages.length) return;

    // Scroll to bottom when a new message is added
    let composeStarted =
      this.props.messages[0].state !== "composing" &&
      nextProps.messages[0].state === "composing";

    if (composeStarted) {
      this.refs.list.getScrollResponder().scrollTo({ y: 0 });
    }
  }

  render() {
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
  }

  renderScrollComponent = props => {
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
  };

  renderMessage = ({ index, item }) => {
    let fromCurrentUser =
      this.props.user.id === item.senderId || !item.senderId;

    return (
      <Message
        onToggleExpansion={this.handleToggleMessageExpansion}
        onRetrySend={this.handleRetryMessageSend}
        fromCurrentUser={fromCurrentUser}
        message={item}
        {...item}
      />
    );
  };

  handleScroll = e => {
    let scrollOffset = e.nativeEvent.contentOffset.y;

    if (
      scrollOffset < BEGINNING_REACHED_OFFSET &&
      this.state.scrollOffset >= BEGINNING_REACHED_OFFSET
    ) {
      this.props.onBeginningReached();
    }

    this.setState({ scrollOffset });
    if (this.props.scrollBridge) this.props.scrollBridge.handleScroll(e);
  };

  handleToggleMessageExpansion = async (message, position, nextSize) => {
    // Don't expand message if scroll is locked
    if (this.props.scrollLocked) return;

    this.props.onToggleMessageExpansion(message);

    // Return if the message is closing
    if (message.expanded) return;

    // Note that top and bottom are flipped here
    // as we're using an InvertibleScrollView
    let { height, width } = Dimensions.get("window");
    let nextTop = position.top + position.height - nextSize.height;
    let nextOffset = nextTop - Style.values.rowHeight - getStatusBarHeight();

    if (nextOffset < 0) {
      this.refs.list
        .getScrollResponder()
        .scrollTo({ y: this.state.scrollOffset - nextOffset });
    }
  };

  handleRetryMessageSend = message => {
    this.props.onRetryMessageSend(message);
  };
}

let style = Style.create({
  outerContainer: {
    flex: 1
  },
  container: {
    flex: 1
  },
  list: {
    overflow: "hidden"
  }
});

export default MessageList;
