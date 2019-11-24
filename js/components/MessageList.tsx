import React, {Component, createRef} from 'react';
import {
  FlatList,
  ScrollView,
  ScrollViewProps,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ListRenderItemInfo,
} from 'react-native';
import Style from '../style';
import Message from './Message';
import {Message as MessageData, FinishedMessage} from '../store/messages/types';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {getId, isFromUser, isExpanded} from '../lib/MessageUtils';
import {User} from '../store/user/types';
import ScrollBridge from '../lib/ScrollBridge';
import {NodeMeasurement} from '../lib/measure';

const BEGINNING_REACHED_OFFSET = 1000;

const getMessageKey = (message: MessageData) => getId(message).toString();

interface MessageListProps {
  messages: MessageData[];
  user: User;
  scrollLocked: boolean;
  scrollBridge: ScrollBridge;
  onToggleMessageExpansion: (message: FinishedMessage) => void;
  onRetryMessageSend: (message: MessageData) => void;
  onBeginningReached: () => void;
  onEndReached: () => void;
}

interface MessageListState {}

class MessageList extends Component<MessageListProps, MessageListState> {
  listRef = createRef<FlatList<MessageData>>();

  state = {
    scrollOffset: 0,
  };

  shouldComponentUpdate(
    nextProps: MessageListProps,
    nextState: MessageListState,
  ) {
    return (
      this.props.messages !== nextProps.messages ||
      this.props.scrollLocked !== nextProps.scrollLocked ||
      this.props.user.id !== nextProps.user.id
    );
  }

  componentWillReceiveProps(nextProps: MessageListProps) {
    if (this.props.messages === nextProps.messages) return;

    if (!this.props.messages.length || !nextProps.messages.length) return;

    // Scroll to bottom when a new message is added
    const composeStarted =
      this.props.messages[0].state !== 'working' &&
      nextProps.messages[0].state === 'working';

    if (composeStarted && this.listRef.current) {
      this.listRef.current.scrollToOffset({
        animated: true,
        offset: 0,
      });
    }
  }

  render() {
    return (
      <FlatList
        ref={this.listRef}
        style={style.list}
        data={this.props.messages}
        keyExtractor={getMessageKey}
        inverted={true}
        initialNumToRender={16}
        maxToRenderPerBatch={16}
        renderItem={this.renderMessage}
        renderScrollComponent={this.renderScrollComponent}
        onEndReached={this.props.onEndReached}
      />
    );
  }

  renderScrollComponent = (props: ScrollViewProps) => {
    let onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      props.onScroll && props.onScroll(e);
      this.handleScroll(e);
    };

    return (
      <ScrollView
        {...props}
        onScroll={onScroll}
        scrollEnabled={!this.props.scrollLocked}
      />
    );
  };

  renderMessage = ({item}: ListRenderItemInfo<MessageData>) => {
    return (
      <Message
        onToggleExpansion={this.handleToggleMessageExpansion}
        onRetrySend={this.handleRetryMessageSend}
        fromCurrentUser={isFromUser(this.props.user, item)}
        message={item}
        {...item}
      />
    );
  };

  handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let scrollOffset = e.nativeEvent.contentOffset.y;

    if (
      scrollOffset < BEGINNING_REACHED_OFFSET &&
      this.state.scrollOffset >= BEGINNING_REACHED_OFFSET
    ) {
      this.props.onBeginningReached();
    }

    this.setState({scrollOffset});
    if (this.props.scrollBridge) this.props.scrollBridge.handleScroll(e);
  };

  handleToggleMessageExpansion = async (
    message: MessageData,
    position: NodeMeasurement,
    nextSize: {width: number; height: number},
  ) => {
    // Don't expand message if scroll is locked
    if (this.props.scrollLocked) return;

    this.props.onToggleMessageExpansion(message as FinishedMessage);

    // Return if the message is closing
    if (isExpanded(message)) return;

    // Note that top and bottom are flipped here
    // as we're using an InvertibleScrollView
    let nextTop = position.top + position.height - nextSize.height;
    let nextOffset = nextTop - Style.values.rowHeight - getStatusBarHeight();

    if (nextOffset < 0) {
      // TODO: Handle case where because message has not
      // yet expanded there isn't any space to scroll up to
      setTimeout(() => {
        this.listRef.current?.scrollToOffset({
          offset: this.state.scrollOffset - nextOffset,
        });
      }, 100);
    }
  };

  handleRetryMessageSend = (message: MessageData) => {
    this.props.onRetryMessageSend(message);
  };
}

let style = Style.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  list: {
    overflow: 'hidden',
  },
});

export default MessageList;