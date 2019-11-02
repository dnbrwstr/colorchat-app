import React, {PureComponent} from 'react';
import {View, Animated, Easing} from 'react-native';
import Color from 'color';
import Style from '../style';
import measure from '../lib/measure';
import EditableMessage from './EditableMessage';
import BaseText from './BaseText';
import PressableView from './PressableView';
import {humanDate} from '../lib/Utils';
import {MessageType} from '../lib/MessageUtils';

const SPRING_TENSION = 150;
const SPRING_FRICTION = 10;

const EXPANDED_MIN_WIDTH = 320;
const EXPANDED_MIN_HEIGHT = 320;

const FAILED_MIN_WIDTH = 250;
const FAILED_MIN_HEIGHT = 100;

const getBorderRadius = (w, h) => Math.min(w, h / 2);

class Message extends PureComponent {
  static defaultProps = {
    onToggleExpansion: () => {},
    onRetrySend: () => {},
  };

  currentAnimation = null;

  constructor(props) {
    super(props);

    const width = props.width;
    const height = props.animateEntry ? 0 : props.height;
    const borderRadius =
      this.props.type === MessageType.Picture
        ? getBorderRadius(width, height)
        : 0;

    this.state = {
      width,
      height,
      borderRadius,
      animatedWidth: new Animated.Value(width),
      animatedHeight: new Animated.Value(height),
      animatedBorderRadius: new Animated.Value(borderRadius),
      hasEntered: !this.props.animateEntry,
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

  static getDerivedStateFromProps = (props, prevState = {}) => {
    const size = {
      width: props.width,
      height: props.height,
      borderRadius:
        props.type === MessageType.Picture
          ? getBorderRadius(props.width, props.height)
          : 0,
    };

    if (!prevState.hasEntered) {
      size.width = 0;
      size.height = 0;
    } else if (
      props.state === 'complete' ||
      props.state === 'fresh' ||
      prevState.retrying
    ) {
      if (props.expanded) {
        size.width = Math.max(props.width, EXPANDED_MIN_WIDTH);
        size.height = Math.max(props.height, EXPANDED_MIN_HEIGHT);
        size.borderRadius = 0;
      }
    } else if (props.state === 'failed') {
      size.width = Math.max(props.width, FAILED_MIN_WIDTH);
      size.height = Math.max(props.height, FAILED_MIN_HEIGHT);
      size.borderRadius = 0;
    } else if (props.state === 'cancelling') {
      size.height = 0;
    }

    return size;
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.state === 'composing') {
      this.state.animatedWidth.setValue(this.state.width);
      this.state.animatedHeight.setValue(this.state.height);
      this.state.animatedBorderRadius.setValue(this.state.borderRadius);
    } else {
      this.resize(prevState);
    }
  }

  resize(prevState) {
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
    ].filter(a => !!a);

    this.currentAnimation = Animated.parallel(animations);
    this.currentAnimation.start(() => {
      this.currentAnimation = null;
    });
  }

  render() {
    if (this.props.state === 'composing') {
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
        ref="message"
        style={this.getMessageStyles()}
        onPress={this.handlePress}
      >
        {this.renderContent()}
      </PressableView>
    );
  }

  renderContent() {
    if (this.props.state === 'failed' && !this.state.retrying) {
      return (
        <View style={style.textContainer}>
          <View>
            <BaseText visibleOn={this.props.color}>
              Message failed to send
            </BaseText>
            <BaseText visibleOn={this.props.color}>Tap to retry</BaseText>
          </View>
        </View>
      );
    } else if (this.props.expanded === true) {
      const rgb = new Color(this.props.color).rgb();
      return (
        <View style={style.textContainer}>
          <BaseText style={[style.text]} visibleOn={this.props.color}>
            {this.props.colorName}
            {'\n'}
            {this.props.color}
            {/* {"\n"}
            {`r: ${rgb.r} \ng: ${rgb.g} \nb:${rgb.b}`} */}
          </BaseText>
          <BaseText
            style={[style.timestamp, style.text]}
            visibleOn={this.props.color}
          >
            {humanDate(this.props.createdAt)}
          </BaseText>
        </View>
      );
    } else {
      return null;
    }
  }

  handlePress = async () => {
    if (this.props.state === 'failed') {
      this.setState({retrying: true});
      this.resendTimer = setTimeout(() => {
        this.setState({retrying: false});
        this.props.onRetrySend(this.props.message);
      }, 500);
    } else if (
      this.props.state === 'complete' ||
      this.props.state === 'fresh'
    ) {
      let position = await measure(this.refs.message);
      this.props.onToggleExpansion(this.props.message, position, {
        width: Math.max(this.props.width, EXPANDED_MIN_WIDTH),
        height: Math.max(this.props.height, EXPANDED_MIN_HEIGHT),
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
        backgroundColor: this.props.color,
      },
      this.props.type === MessageType.Picture &&
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
