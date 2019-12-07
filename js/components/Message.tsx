import React, {PureComponent, createRef} from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Style from '../style';
import measure, {NodeMeasurement} from '../lib/measure';
import EditableMessage from './EditableMessage';
import PressableView from './PressableView';
import {Message as MessageData, FinishedMessage} from '../store/messages/types';
import {isExpanded} from '../lib/MessageUtils';
import MessageContent from './MessageContent';

const SPRING_TENSION = 150;
const SPRING_FRICTION = 10;

const EXPANDED_MIN_WIDTH = Dimensions.get('window').width * 0.9;
const EXPANDED_MIN_HEIGHT = EXPANDED_MIN_WIDTH;

const FAILED_MIN_WIDTH = 250;
const FAILED_MIN_HEIGHT = 100;

type MessageProps = {
  onExpand: (
    message: MessageData,
    layout: NodeMeasurement,
    size: {width: number; height: number},
  ) => void;
  onCollapse: (message: MessageData) => void;
  onRetrySend: (message: MessageData) => void;
  onPressEcho: (message: MessageData) => void;
  message: MessageData;
  fromCurrentUser: boolean;
};

interface MessageState {
  hasEntered: boolean;
  width: number;
  height: number;
  animatedWidth: Animated.Value;
  animatedHeight: Animated.Value;
  retrying: boolean;
  contentsActive: boolean;
}

class Message extends PureComponent<MessageProps, MessageState> {
  resendTimer = -1;
  messageRef = createRef<TouchableWithoutFeedback>();
  currentAnimation?: Animated.CompositeAnimation;

  constructor(props: MessageProps) {
    super(props);

    const animateEntry = !!(props.message as FinishedMessage).animateEntry;
    const width = Math.round(props.message.width);
    const height = animateEntry ? 0 : Math.round(props.message.height);

    this.state = {
      width,
      height,
      animatedWidth: new Animated.Value(width),
      animatedHeight: new Animated.Value(height),
      hasEntered: !animateEntry,
      retrying: false,
      contentsActive: false,
    };
  }

  componentDidMount() {
    if (!this.state.hasEntered) {
      this.setState({
        hasEntered: true,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.resendTimer);
  }

  static getDerivedStateFromProps = (
    props: MessageProps,
    prevState: MessageState,
  ) => {
    const {message} = props;
    const state = {
      width: message.width,
      height: message.height,
      contentOpacity: 0,
      contentsActive: prevState.contentsActive,
    };

    if (!prevState.hasEntered) {
      state.height = 0;
    } else if (
      message.state === 'complete' ||
      message.state === 'fresh' ||
      (message.state === 'failed' && prevState.retrying)
    ) {
      if (message.expanded) {
        state.width = Math.max(message.width, EXPANDED_MIN_WIDTH);
        state.height = Math.max(message.height, EXPANDED_MIN_HEIGHT);
        state.contentOpacity = 1;
        state.contentsActive = true;
      }
    } else if (message.state === 'failed') {
      state.width = Math.max(message.width, FAILED_MIN_WIDTH);
      state.height = Math.max(message.height, FAILED_MIN_HEIGHT);
      state.contentOpacity = 0;
    } else if (message.state === 'cancelling') {
      state.height = 0;
    }

    state.width = Math.round(state.width);
    state.height = Math.round(state.height);

    return state;
  };

  componentDidUpdate(prevProps: MessageProps, prevState: MessageState) {
    if (this.props.message.state === 'working') {
      this.state.animatedWidth.setValue(this.state.width);
      this.state.animatedHeight.setValue(this.state.height);
    } else {
      this.resize(prevState);
    }
  }

  resize(prevState: MessageState) {
    const {width, height} = this.state;

    const shouldSizeWidth = width !== prevState.width;
    const shouldSizeHeight = height !== prevState.height;

    if (!shouldSizeWidth && !shouldSizeHeight) {
      return;
    }

    if (this.currentAnimation) {
      this.currentAnimation.stop();
    }

    const baseOpts = {
      tension: SPRING_TENSION,
      friction: SPRING_FRICTION,
      duration: 200,
    };

    const heightFn = height > 20 ? 'spring' : 'timing';
    const widthFn = width > 20 ? 'spring' : 'timing';

    const animations = [
      shouldSizeWidth &&
        Animated[widthFn](this.state.animatedWidth, {
          ...baseOpts,
          toValue: width,
        }),
      shouldSizeHeight &&
        Animated[heightFn](this.state.animatedHeight, {
          ...baseOpts,
          toValue: height,
        }),
    ].filter(a => {
      if (!a) return false;
      else return true;
    }) as Animated.CompositeAnimation[];

    this.currentAnimation = Animated.parallel(animations);
    this.currentAnimation.start(({finished}) => {
      this.currentAnimation = undefined;
      if (
        finished &&
        !isExpanded(this.props.message) &&
        this.state.contentsActive
      ) {
        this.setState({contentsActive: false});
      }
    });
  }

  render() {
    return this.props.message.state === 'working' ? (
      <EditableMessage {...this.props} />
    ) : (
      <PressableView
        forwardRef={this.messageRef}
        style={this.getMessageStyles()}
        onPress={this.handlePress}
      >
        <MessageContent
          message={this.props.message}
          resending={this.state.retrying}
          onPressEcho={this.handlePressEcho}
        />
      </PressableView>
    );
  }

  handlePress = async () => {
    if (this.props.message.state === 'failed') {
      this.setState({retrying: true});
      this.resendTimer = setTimeout(() => {
        this.setState({retrying: false});
        this.props.onRetrySend(this.props.message);
      }, 500);
    } else if (
      this.props.message.state === 'complete' ||
      this.props.message.state === 'fresh' ||
      this.props.message.state === 'static'
    ) {
      this.toggleExpansion();
    }
  };

  handlePressEcho = async () => {
    this.props.onPressEcho(this.props.message);
  };

  toggleExpansion = async () => {
    if (isExpanded(this.props.message)) {
      this.props.onCollapse && this.props.onCollapse(this.props.message);
    } else {
      const position = await measure(this.messageRef);
      this.props.onExpand(this.props.message, position, {
        width: Math.max(this.props.message.width, EXPANDED_MIN_WIDTH),
        height: Math.max(this.props.message.height, EXPANDED_MIN_HEIGHT),
      });
    }
  };

  getMessageStyles() {
    return [
      style.message,
      this.props.fromCurrentUser ? style.sent : style.received,
      {
        width: this.state.animatedWidth,
        height: this.state.animatedHeight,
        backgroundColor: this.props.message.color,
      },
    ];
  }
}

const style = StyleSheet.create({
  message: {
    flex: 0,
    overflow: 'hidden',
  },
  sent: {
    alignSelf: 'flex-end',
  },
  received: {
    alignSelf: 'flex-start',
  },
});

export default Message;
