import React, {Component, createRef, FC} from 'react';
import {
  FlatList,
  ScrollView,
  ScrollViewProps,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ListRenderItemInfo,
  Platform,
  View,
  StyleSheet,
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
  messageExpanded: boolean;
  onMessageEchoed: (message: FinishedMessage) => void;
  onMessageExpanded: (message: FinishedMessage) => void;
  onMessageCollapsed: (message: FinishedMessage) => void;
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
      this.props.messageExpanded !== nextProps.messageExpanded ||
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
        ListFooterComponent={MessageListSpacer}
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

    const scrollEnabled = this.props.messageExpanded
      ? false
      : !this.props.scrollLocked;

    return (
      <ScrollView
        {...props}
        onScroll={onScroll}
        contentContainerStyle={style.scrollView}
        scrollEnabled={scrollEnabled}
      />
    );
  };

  renderMessage = ({item}: ListRenderItemInfo<MessageData>) => {
    return (
      <Message
        onExpand={this.handleMessageExpanded}
        onCollapse={this.handleMessageCollapsed}
        onRetrySend={this.handleRetryMessageSend}
        onPressEcho={this.handleMessageEchoed}
        fromCurrentUser={isFromUser(this.props.user, item)}
        message={item}
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

  handleMessageExpanded = async (
    message: MessageData,
    position: NodeMeasurement,
    nextSize: {width: number; height: number},
  ) => {
    if (this.props.scrollLocked || this.props.messageExpanded) return;

    this.props.onMessageExpanded(message as FinishedMessage);

    // Note that top and bottom are flipped here
    // as we're using an InvertibleScrollView
    let nextTop = position.top + position.height - nextSize.height;
    let nextOffset = nextTop - Style.values.rowHeight;
    if (Platform.OS === 'ios') nextOffset -= getStatusBarHeight();

    this.listRef.current?.scrollToOffset({
      offset: this.state.scrollOffset - nextOffset,
    });
  };

  handleMessageCollapsed = (message: MessageData) => {
    if (this.props.scrollLocked) return;
    this.props.onMessageCollapsed(message as FinishedMessage);
  };

  handleRetryMessageSend = (message: MessageData) => {
    this.props.onRetryMessageSend(message);
  };

  handleMessageEchoed = (message: MessageData) => {
    this.props.onMessageEchoed(message as FinishedMessage);
  };
}

const MessageListSpacer: FC<{}> = () => {
  return <View style={style.spacer} />;
};

let style = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  list: {
    overflow: 'hidden',
  },
  scrollView: {
    paddingBottom: 0,
  },
  spacer: {
    height: 500,
  },
});

export default MessageList;
