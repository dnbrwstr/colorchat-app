import React from 'react-native';
import Color from 'color';
import moment from 'moment';
import Style from '../style';
import EditableMessage from './EditableMessage';
import BaseText from './BaseText';
import PressableView from './PressableView';

let {
  View,
  LayoutAnimation,
  Text,
  Animated
} = React;

const SPRING_TENSION = 150;
const SPRING_FRICTION = 10;

let Message = React.createClass({
  getInitialState: function () {
    let defaultWidth = this.props.width;
    let defaultHeight = this.props.height;

    return {
      width: defaultWidth,
      height: defaultHeight,
      animatedWidth: new Animated.Value(defaultWidth),
      animatedHeight: new Animated.Value(defaultHeight)
    };
  },

  componentDidMount: function () {
    this.setSize();
  },

  componentDidUpdate: function (prevProps) {
    this.setSize(prevProps);
  },

  setSize: function (prevProps) {
    let expandUpdated = !prevProps || (this.props.expanded !== prevProps.expanded);
    let stateUpdated = !prevProps || (this.props.state !== prevProps.state);

    if (this.props.state === 'fresh') {
      // * => fresh
      this.resize({
        width: this.props.width,
        height: this.props.height
      }, {
        width: 0,
        height: 0
      }, this.props.onPresent);
    } else if (this.props.state === 'complete') {
      if (this.props.expanded) {
        // not expanded => expanded
        let minWidth = 320;
        let minHeight = 320;

        this.resize({
          width: Math.max(this.props.width, minWidth),
          height: Math.max(this.props.height, minHeight)
        });
      } else {
        // expanded => not expanded
        this.resize({
          width: this.props.width,
          height: this.props.height
        });
      }
    } else if (this.props.state === 'failed') {
      // * => failed
      let minWidth = 250;
      let minHeight = 100;

      this.resize({
        width: Math.max(this.props.width, minWidth),
        height: Math.max(this.props.height, minHeight)
      });
    } else if (this.props.state === 'composing') {
      if (this.props.width !== this.state.width ||
        this.props.height !== this.state.height) {
        this.setState({
          width: this.props.width,
          height: this.props.height
        });
        this.state.animatedWidth.setValue(this.props.width);
        this.state.animatedHeight.setValue(this.props.height);
      }
    } else {
      this.resize({
        width: this.props.width,
        height: this.props.height
      });
    }
  },

  resize: function (toSize, fromSize={}, cb) {
    if ((!toSize.width || toSize.width === this.state.width) &&
       (!toSize.height || toSize.height === this.state.height)) {
      return;
    }

    let width = this.state.animatedWidth;
    let height = this.state.animatedHeight;

    if (fromSize.width) width.setValue(fromSize.width);
    if (fromSize.height) height.setValue(fromSize.height);

    let animations = [];
    let baseOpts = {
      tension: SPRING_TENSION,
      friction: SPRING_FRICTION
    };

    if (toSize.width) {
      animations.push(Animated.spring(width, {
        ...baseOpts,
        toValue: toSize.width
      }));
    }

    if (toSize.height) {
      animations.push(Animated.spring(height, {
        ...baseOpts,
        toValue: toSize.height
      }));
    }

    this.setState(toSize);

    Animated.parallel(animations).start(cb);
  },

  render: function () {
    return this.props.state === 'composing' ?
      this.renderEditor() : this.renderMessage();
  },

  renderEditor: function () {
    return <EditableMessage {...this.props} />
  },

  renderMessage: function () {
    return (
      <PressableView
        style={this.getMessageStyles()}
        onPress={this.onPress}
      >
        { this.renderContent() }
      </PressableView>
    );
  },

  renderContent: function () {
    if (this.props.state === 'failed') {
      return (
        <View style={style.textContainer}>
          <BaseText visibleOn={this.props.color}>
            Message failed to send
          </BaseText>
          <BaseText visibleOn={this.props.color}>
            Tap to retry
          </BaseText>
        </View>
      );
    }
    else if (this.props.expanded === true){
      return (
        <View style={style.textContainer}>
          <BaseText visibleOn={this.props.color}>
            { this.props.color + "\n"}
          </BaseText>
          <BaseText visibleOn={this.props.color}>
            { this.getRGBFormattedColor() }
          </BaseText>
          <BaseText style={style.timestamp} visibleOn={this.props.color}>
            { this.getFormattedTimestamp() }
          </BaseText>
        </View>
      );
    }
  },

  onPress: function () {
    if (this.props.state === 'failed' && this.props.onRetrySend) {
      this.props.onRetrySend();
    } else if (this.props.state === 'complete' && this.props.onToggleExpansion) {
      this.props.onToggleExpansion();
    }
  },

  getMessageStyles: function () {
    return [
      style.message,
      this.props.fromCurrentUser ? style.sent : style.received,
      {
        width: this.state.animatedWidth,
        height: this.state.animatedHeight,
        backgroundColor: this.props.color
      }
    ];
  },

  getFormattedTimestamp: function () {
    let aYearAgo = moment(new Date()).subtract(1, 'years');
    let aWeekAgo = moment(new Date()).subtract(1, 'weeks');
    let aDayAgo = moment(new Date()).subtract(1, 'days');
    let time = moment(this.props.createdAt);

    if (time.isBefore(aYearAgo)) {
      return time.format('MMM Do YYYY, h:mm A');
    } else if (time.isBefore(aWeekAgo)) {
      return time.format('MMM Do, h:mm A');
    } else if (time.isBefore(aDayAgo)) {
      return time.format('ddd, h:mm A')
    } else {
      return time.fromNow(false);
    }
  },

  getRGBFormattedColor: function () {
    let rgb = Color(this.props.color).rgb();
    return `R ${rgb.r}\nG ${rgb.g}\nB ${rgb.b}`;
  }
});

let style = Style.create({
  message: {
    flex: 0,
    overflow: 'hidden'
  },
  sent: {
    alignSelf: 'flex-end'
  },
  received: {
    alignSelf: 'flex-start'
  },
  timestamp: {
    position: 'absolute',
    top: 12,
    right: 12
  },
  textContainer: {
    flex: 1,
    padding: 12
  },
  text: {
    ...Style.mixins.textBase,
    top: 15,
    left: 15,
  }
});

export default Message;