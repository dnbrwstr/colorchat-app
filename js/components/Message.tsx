import React, {PureComponent, ReactNode, createRef} from 'react';
import {
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  LayoutRectangle,
} from 'react-native';
import Color from 'color';
import Style from '../style';
import measure, {NodeMeasurement} from '../lib/measure';
import EditableMessage from './EditableMessage';
import BaseText from './BaseText';
import PressableView from './PressableView';
import {humanDate} from '../lib/Utils';
import {
  Message as MessageData,
  MessageType,
  FinishedMessage,
} from '../store/messages/types';

const SPRING_TENSION = 150;
const SPRING_FRICTION = 10;

const EXPANDED_MIN_WIDTH = 320;
const EXPANDED_MIN_HEIGHT = 320;

const FAILED_MIN_WIDTH = 250;
const FAILED_MIN_HEIGHT = 100;

const getBorderRadius = (w: number, h: number) => Math.min(w, h / 2);

type MessageProps = {
  onToggleExpansion: (
    message: MessageData,
    layout: NodeMeasurement,
    size: {width: number; height: number},
  ) => void;
  onRetrySend: (message: MessageData) => void;
  message: MessageData;
  fromCurrentUser: boolean;
};

interface MessageState {
  hasEntered: boolean;
  width: number;
  height: number;
  borderRadius: number;
  animatedWidth: Animated.Value;
  animatedHeight: Animated.Value;
  animatedBorderRadius: Animated.Value;
  retrying: boolean;
}

class Message extends PureComponent<MessageProps, MessageState> {
  resendTimer = -1;
  messageRef = createRef<TouchableWithoutFeedback>();
  currentAnimation?: Animated.CompositeAnimation;

  constructor(props: MessageProps) {
    super(props);

    const animateEntry = !!(props.message as FinishedMessage).animateEntry;

    const width = props.message.width;
    const height = animateEntry ? 0 : props.message.height;
    const borderRadius =
      this.props.message.type === MessageType.Picture
        ? getBorderRadius(width, height)
        : 0;

    this.state = {
      width,
      height,
      borderRadius,
      animatedWidth: new Animated.Value(width),
      animatedHeight: new Animated.Value(height),
      animatedBorderRadius: new Animated.Value(borderRadius),
      hasEntered: !animateEntry,
      retrying: false,
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
    const size = {
      width: message.width,
      height: message.height,
      borderRadius:
        message.type === MessageType.Picture
          ? getBorderRadius(message.width, message.height)
          : 0,
    };

    if (!prevState.hasEntered) {
      size.width = 0;
      size.height = 0;
    } else if (
      message.state === 'complete' ||
      message.state === 'fresh' ||
      (message.state === 'failed' && prevState.retrying)
    ) {
      if (message.expanded) {
        size.width = Math.max(message.width, EXPANDED_MIN_WIDTH);
        size.height = Math.max(message.height, EXPANDED_MIN_HEIGHT);
        size.borderRadius = 0;
      }
    } else if (message.state === 'failed') {
      size.width = Math.max(message.width, FAILED_MIN_WIDTH);
      size.height = Math.max(message.height, FAILED_MIN_HEIGHT);
      size.borderRadius = 0;
    } else if (message.state === 'cancelling') {
      size.height = 0;
    }

    return size;
  };

  componentDidUpdate(prevProps: MessageProps, prevState: MessageState) {
    if (this.props.message.state === 'working') {
      this.state.animatedWidth.setValue(this.state.width);
      this.state.animatedHeight.setValue(this.state.height);
      this.state.animatedBorderRadius.setValue(this.state.borderRadius);
    } else {
      this.resize(prevState);
    }
  }

  resize(prevState: MessageState) {
    const {width, height, borderRadius} = this.state;

    const shouldSizeWidth = width !== prevState.width;
    const shouldSizeHeight = height !== prevState.height;
    const shouldSizeBorderRadius = borderRadius !== prevState.borderRadius;

    if (!shouldSizeWidth && !shouldSizeHeight && !shouldSizeBorderRadius) {
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
      shouldSizeBorderRadius &&
        Animated.timing(this.state.animatedBorderRadius, {
          toValue: borderRadius,
          duration: 200,
          easing: Easing.linear,
        }),
    ].filter(a => {
      if (!a) return false;
      else return true;
    }) as Animated.CompositeAnimation[];

    this.currentAnimation = Animated.parallel(animations);
    this.currentAnimation.start(() => {
      this.currentAnimation = undefined;
    });
  }

  render() {
    if (this.props.message.state === 'working') {
      return this.renderEditor();
    } else {
      return this.renderMessage();
    }
  }

  renderEditor() {
    return <EditableMessage {...this.props} />;
  }

  renderMessage() {
    return (
      <PressableView
        ref={this.messageRef}
        style={this.getMessageStyles()}
        onPress={this.handlePress}
      >
        {this.renderContent()}
      </PressableView>
    );
  }

  renderContent() {
    const {message} = this.props;
    const finishedMessage = message as FinishedMessage;
    const isExpanded = finishedMessage.expanded;

    if (message.state === 'failed' && !this.state.retrying) {
      return (
        <View style={style.textContainer}>
          <View>
            <BaseText visibleOn={message.color}>
              Message failed to send
            </BaseText>
            <BaseText visibleOn={message.color}>Tap to retry</BaseText>
          </View>
        </View>
      );
    } else if (isExpanded === true) {
      const rgb = new Color(finishedMessage.color).rgb();
      return (
        <View style={style.textContainer}>
          <BaseText style={[style.text]} visibleOn={finishedMessage.color}>
            {finishedMessage.colorName}
            {'\n'}
            {finishedMessage.color}
            {/* {"\n"}
            {`r: ${rgb.r} \ng: ${rgb.g} \nb:${rgb.b}`} */}
          </BaseText>
          <BaseText
            style={[style.timestamp, style.text]}
            visibleOn={finishedMessage.color}
          >
            {humanDate(finishedMessage.createdAt)}
          </BaseText>
        </View>
      );
    } else {
      return null;
    }
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
      this.props.message.state === 'fresh'
    ) {
      const position = await measure(this.messageRef);
      this.props.onToggleExpansion(this.props.message, position, {
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
      this.props.message.type === MessageType.Picture &&
        (this.props.fromCurrentUser
          ? {
              borderBottomLeftRadius: this.state.animatedBorderRadius,
              borderTopLeftRadius: this.state.animatedBorderRadius,
            }
          : {
              borderTopRightRadius: this.state.animatedBorderRadius,
              borderBottomRightRadius: this.state.animatedBorderRadius,
            }),
    ];
  }
}

let style = Style.create({
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
  sentPicture: {
    borderTopLeftRadius: 1000,
    borderBottomLeftRadius: 1000,
  },
  receivedPicture: {
    borderTopRightRadius: 1000,
    borderBottomRightRadius: 1000,
  },
  textContainer: {
    flex: 1,
    padding: 16,
    flexShrink: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: EXPANDED_MIN_WIDTH,
  },
  timestamp: {
    textAlign: 'right',
  },
  text: {
    width: '50%',
  },
});

export default Message;
