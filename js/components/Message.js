import React, { PureComponent } from "react";
import { View, Animated } from "react-native";
import Color from "color";
import Style from "../style";
import measure from "../lib/measure";
import EditableMessage from "./EditableMessage";
import BaseText from "./BaseText";
import PressableView from "./PressableView";
import { humanDate } from "../lib/Utils";

const SPRING_TENSION = 150;
const SPRING_FRICTION = 10;

const EXPANDED_MIN_WIDTH = 320;
const EXPANDED_MIN_HEIGHT = 320;

const FAILED_MIN_WIDTH = 250;
const FAILED_MIN_HEIGHT = 100;

class Message extends PureComponent {
  static defaultProps = {
    onToggleExpansion: () => {},
    onRetrySend: () => {}
  };

  constructor(props) {
    super(props);

    let defaultWidth = props.width;
    let defaultHeight = props.state === "fresh" ? 0 : props.height;

    this.state = {
      width: defaultWidth,
      height: defaultHeight,
      animatedWidth: new Animated.Value(defaultWidth),
      animatedHeight: new Animated.Value(defaultHeight),
      currentAnimation: null,
      retrying: false
    };
  }

  componentDidMount() {
    this.setSize();
  }

  componentWillUnmount() {
    clearTimeout(this.resendTimer);
  }

  componentDidUpdate(prevProps) {
    this.setSize(prevProps);
  }

  setSize(prevProps) {
    let baseSize = {
      width: this.props.width,
      height: this.props.height
    };

    if (this.props.state === "fresh") {
      // * => fresh
      this.resize(baseSize, {
        width: 0,
        height: 0
      });
    } else if (this.props.state === "complete" || this.state.retrying) {
      if (this.props.expanded) {
        // unexpanded => expanded
        this.resize({
          width: Math.max(this.props.width, EXPANDED_MIN_WIDTH),
          height: Math.max(this.props.height, EXPANDED_MIN_HEIGHT)
        });
      } else {
        // expanded => unexpanded
        this.resize(baseSize);
      }
    } else if (this.props.state === "failed") {
      // * => failed
      this.resize({
        width: Math.max(this.props.width, FAILED_MIN_WIDTH),
        height: Math.max(this.props.height, FAILED_MIN_HEIGHT)
      });
    } else if (this.props.state === "composing") {
      // Just keep up with edits if we're composing
      if (
        this.props.width !== this.state.width ||
        this.props.height !== this.state.height
      ) {
        this.setState(baseSize);
        this.state.animatedWidth.setValue(this.props.width);
        this.state.animatedHeight.setValue(this.props.height);
      }
    } else if (this.props.state === "cancelling") {
      this.resize({
        height: 0
      });
    } else {
      this.resize(baseSize);
    }
  }

  resize(toSize, fromSize = {}, cb) {
    let shouldSizeWidth =
      typeof toSize.width !== "undefined" && toSize.width !== this.state.width;
    let shouldSizeHeight =
      typeof toSize.height !== "undefined" &&
      toSize.height !== this.state.height;

    if (!shouldSizeWidth && !shouldSizeHeight) {
      cb && cb();
      return;
    }

    if (this.state.currentAnimation) {
      this.state.currentAnimation.stop();
    }

    let width = this.state.animatedWidth;
    let height = this.state.animatedHeight;

    if (fromSize.width) width.setValue(fromSize.width);
    if (fromSize.height) height.setValue(fromSize.height);

    let animations = [];
    let baseOpts = {
      tension: SPRING_TENSION,
      friction: SPRING_FRICTION,
      duration: 200
    };

    if (shouldSizeWidth) {
      let fn = toSize.width > 20 ? "spring" : "timing";
      animations.push(
        Animated[fn](width, {
          ...baseOpts,
          toValue: toSize.width
        })
      );
    }

    if (shouldSizeHeight) {
      let fn = toSize.height > 20 ? "spring" : "timing";
      animations.push(
        Animated[fn](height, {
          ...baseOpts,
          toValue: toSize.height
        })
      );
    }

    let animation = Animated.parallel(animations);
    animation.start(() => {
      cb && cb();
      this.setState({ currentAnimation: null });
    });

    this.setState({
      ...toSize,
      currentAnimation: animation
    });
  }

  render() {
    if (this.props.state === "composing") {
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
    if (this.props.state === "failed" && !this.state.retrying) {
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
      return (
        <View style={style.textContainer}>
          <BaseText style={[style.text]} visibleOn={this.props.color}>
            {this.props.colorName}
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
      return (
        <View style={style.textContainer}>
          <BaseText>{this.props.messageIndex}</BaseText>
        </View>
      );
    }
  }

  handlePress = async () => {
    if (this.props.state === "failed") {
      this.setState({ retrying: true });
      this.resendTimer = setTimeout(() => {
        this.setState({ retrying: false });
        this.props.onRetrySend();
      }, 500);
    } else if (this.props.state === "complete") {
      let position = await measure(this.refs.message);
      this.props.onToggleExpansion(this.props.message, position, {
        width: Math.max(this.props.width, EXPANDED_MIN_WIDTH),
        height: Math.max(this.props.height, EXPANDED_MIN_HEIGHT)
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
        backgroundColor: this.props.color
      }
    ];
  }

  getRGBFormattedColor() {
    let rgb = Color(this.props.color).rgb();
    return `R ${rgb.r}\nG ${rgb.g}\nB ${rgb.b}`;
  }
}

let style = Style.create({
  message: {
    flex: 0,
    overflow: "hidden"
  },
  sent: {
    alignSelf: "flex-end"
  },
  received: {
    alignSelf: "flex-start"
  },
  textContainer: {
    flex: 1,
    padding: 12,
    paddingHorizontal: 17,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  timestamp: {
    textAlign: "right"
  },
  text: {
    width: "50%"
  }
});

export default Message;
