import PropTypes from "prop-types";
import React from "react";
import createReactClass from "create-react-class";
import { Animated, Dimensions } from "react-native";
import Header from "./Header";
import Style from "../style";
import ScrollBridge from "../lib/ScrollBridge";
import measure from "../lib/measure";
import TimerMixin from "./mixins/TimerMixin";

const HIDE_ANIMATION_DURATION = 200;

let StickyView = createReactClass({
  displayName: "StickyView",
  mixins: [TimerMixin],

  propTypes: {
    autoHide: PropTypes.bool,
    autoHideDelay: PropTypes.number,
    scrollBridge: PropTypes.object
  },

  getDefaultProps: function() {
    return {
      autoHide: false,
      autoHideDelay: 2000
    };
  },

  getInitialState: function() {
    return {
      hidden: false,
      animating: false,
      animatedOffset: new Animated.Value(0),
      contentHeight: 0,
      lastOffset: 0
    };
  },

  componentDidMount: function() {
    if (this.props.autoHide) {
      this.setDelayTimer("hide", this.hide, this.props.autoHideDelay);
    }
    this.props.scrollBridge.addScrollListener(this.handleScroll);
  },

  componentWillUnmount: function() {
    this.clearAllTimers();
    this.props.scrollBridge.removeScrollListener(this.handleScroll);
  },

  hide: function() {
    this.setState({ hidden: true });
    this.animateToValue(-this.state.contentHeight);
  },

  show: function() {
    this.setState({ hidden: false });
    this.animateToValue(0);
  },

  animateToValue: function(value) {
    if (this.state.animation) this.state.animation.abort();

    let animation = Animated.timing(this.state.animatedOffset, {
      toValue: value,
      duration: HIDE_ANIMATION_DURATION
    }).start(this.handleAnimationEnd);

    this.setState({ animation });
  },

  handleAnimationEnd: function() {
    this.setState({ animating: null });
  },

  handleScroll: function(e) {
    let offset = e.nativeEvent.contentOffset.y;
    let height = e.nativeEvent.contentSize.height;
    let screenHeight = Dimensions.get("window").height;

    if (offset <= 0 || offset + screenHeight > height) return;

    let deltaY = this.state.lastOffset - offset;

    if (deltaY > 0 && !this.state.hidden) {
      this.hide();
    } else if (deltaY < 0 && this.state.hidden) {
      this.show();
    }

    this.setState({
      lastOffset: offset
    });
  },

  handleLayout: async function() {
    let contentSize = await measure(this.refs.view);
    this.setState({ contentHeight: contentSize.height });
  },

  render: function() {
    let containerStyles = [
      style.container,
      { transform: [{ translateY: this.state.animatedOffset }] }
    ];

    return (
      <Animated.View
        ref="view"
        style={containerStyles}
        onLayout={this.handleLayout}
      >
        {this.props.children}
      </Animated.View>
    );
  }
});

let style = Style.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent"
  }
});

export default StickyView;
