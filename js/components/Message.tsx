import React, {PureComponent, createRef} from 'react';
import {
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
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
import {isExpanded, getId, getTimestamp} from '../lib/MessageUtils';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

const SPRING_TENSION = 150;
const SPRING_FRICTION = 10;

const EXPANDED_MIN_WIDTH = 290;
const EXPANDED_MIN_HEIGHT = 290;

const FAILED_MIN_WIDTH = 250;
const FAILED_MIN_HEIGHT = 100;

const getBorderRadius = (w: number, h: number) => 1;
const getMaxHeight = () =>
  Dimensions.get('window').height -
  Style.values.rowHeight -
  getStatusBarHeight();

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
  contentOpacity: number;
  animatedWidth: Animated.Value;
  animatedHeight: Animated.Value;
  animatedContentOpacity: Animated.Value;
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
      contentOpacity: 0,
      animatedWidth: new Animated.Value(width),
      animatedHeight: new Animated.Value(height),
      animatedContentOpacity: new Animated.Value(0),
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
        state.width = Math.max(message.width, Dimensions.get('window').width);
        state.height = Math.max(message.height, getMaxHeight());
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
      this.state.animatedContentOpacity.setValue(this.state.contentOpacity);
    } else {
      this.resize(prevState);
    }
  }

  resize(prevState: MessageState) {
    const {width, height, contentOpacity} = this.state;

    const shouldSizeWidth = width !== prevState.width;
    const shouldSizeHeight = height !== prevState.height;
    const shouldChangeContentOpacity =
      contentOpacity !== prevState.contentOpacity;

    if (!shouldSizeWidth && !shouldSizeHeight && !shouldChangeContentOpacity) {
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
      shouldChangeContentOpacity &&
        Animated.timing(this.state.animatedContentOpacity, {
          toValue: contentOpacity,
          duration: 100,
          easing: Easing.linear,
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
        forwardRef={this.messageRef}
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
    } else if (this.state.contentsActive) {
      const opacityStyle = {
        opacity: this.state.animatedContentOpacity,
      };
      const borderColor =
        Color(finishedMessage.color).luminosity() > 0.5 ? 'black' : 'white';
      return (
        <View style={style.textContainer}>
          <BaseText
            style={[style.text, opacityStyle]}
            visibleOn={finishedMessage.color}
          >
            {finishedMessage.colorName}
            {'\n'}
            {finishedMessage.color}
          </BaseText>
          <BaseText
            style={[style.timestamp, style.text, opacityStyle]}
            visibleOn={finishedMessage.color}
          >
            {humanDate(finishedMessage.createdAt)}
          </BaseText>

          {finishedMessage.type === MessageType.Picture && (
            <BaseText
              style={[style.messageType, style.text, opacityStyle]}
              visibleOn={finishedMessage.color}
            >
              Capture with camera
            </BaseText>
          )}

          {finishedMessage.type === MessageType.Echo && (
            <BaseText
              style={[style.messageType, style.text, opacityStyle]}
              visibleOn={finishedMessage.color}
            >
              Echo
            </BaseText>
          )}

          <Animated.View
            style={[style.echoButton, opacityStyle, {borderColor}]}
          >
            <PressableView
              style={style.echoButtonContent}
              onPress={this.handlePressEcho}
            >
              <BaseText visibleOn={finishedMessage.color}>Echo</BaseText>
            </PressableView>
          </Animated.View>
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
        width: Math.max(
          this.props.message.width,
          Dimensions.get('window').width,
        ),
        height: Math.max(this.props.message.height, getMaxHeight()),
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
  messageType: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  echoButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderWidth: 1,
    borderColor: 'white',
  },
  echoButtonContent: {
    padding: Style.values.basePadding * 1.5,
    paddingVertical: Style.values.basePadding,
    flex: 1,
  },
  text: {
    width: '50%',
  },
});

export default Message;
