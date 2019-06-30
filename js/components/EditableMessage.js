import React from "react";
import { View, Dimensions, Animated } from "react-native";
import { connect } from "react-redux";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import Style from "../style";
import DragHandle from "./DragHandle";
import { updateWorkingMessage } from "../actions/MessageActions";
import SimpleColorPicker from "./SimpleColorPicker";
import { constrain } from "../lib/Utils";
import { withScreenFocusState } from "./ScreenFocusState";
import { getFocusStateChange } from "../lib/NavigationUtils";

const MIN_MESSAGE_HEIGHT = 50;
const MAX_MESSAGE_HEIGHT = 400;
const MIN_MESSAGE_WIDTH = 50;
const MAX_MESSAGE_WIDTH = 290;

class EditableMessage extends React.Component {
  state = {
    workingHeight: this.props.height,
    workingWidth: this.props.width,
    workingColor: this.props.color,
    animatedHeight: new Animated.Value(0),
    animatedOpacity: new Animated.Value(0)
  };

  componentDidMount() {
    let animations = [
      Animated.timing(this.state.animatedHeight, {
        toValue: 1,
        duration: 200
      })
    ];

    if (this.shouldShowHandles()) {
      animations.push(
        Animated.timing(this.state.animatedOpacity, {
          toValue: 1,
          duration: 200
        })
      );
    }

    Animated.sequence(animations).start();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState !== this.state ||
      nextProps.composing !== this.props.composing ||
      nextProps.screenFocusState !== this.props.screenFocusState ||
      nextProps.type !== this.props.type ||
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height
    );
  }

  componentDidUpdate(prevProps) {
    let stoppedComposing = prevProps.composing && !this.props.composing;

    if (
      prevProps.width !== this.props.width ||
      prevProps.height !== this.props.height
    ) {
      this.setState({
        workingWidth: this.props.width,
        workingHeight: this.props.height
      });
    }

    const change = getFocusStateChange(
      prevProps.screenFocusState,
      this.props.screenFocusState
    );

    if (stoppedComposing || change.exited) {
      this.state.animatedOpacity.setValue(0);
    } else if (change.entered) {
      this.state.animatedOpacity.setValue(0);
      Animated.timing(this.state.animatedOpacity, {
        toValue: 1,
        duration: 200,
        delay: 300
      }).start();
    }
  }

  render() {
    let messageStyle = {
      width: this.state.workingWidth,
      height: this.state.animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.state.workingHeight]
      }),
      backgroundColor:
        this.props.type === "picture"
          ? this.props.color
          : this.state.workingColor
    };

    let messageStyles = [
      style.message,
      {
        ...messageStyle,
        alignSelf: "flex-end"
      },
      this.props.type === "picture" && style.photoMessage
    ];

    // Render instructions if this is the first
    // message created & it hasn't yet been modified
    let shouldShowInstructions = this.props.messageCount === 1;

    return (
      <Animated.View style={messageStyles}>
        {this.props.type !== "picture" && (
          <SimpleColorPicker
            showInstructions={shouldShowInstructions}
            style={{ flex: 1 }}
            onChange={this.onColorChange}
            initialValue={this.state.workingColor}
          />
        )}
        {this.shouldShowHandles() && this.renderHandles()}
      </Animated.View>
    );
  }

  renderHandles() {
    const statusBarHeight = getStatusBarHeight();
    let screenWidth = Dimensions.get("window").width;
    let screenHeight = Dimensions.get("window").height - statusBarHeight;
    let width = this.state.workingWidth;
    let height = this.state.workingHeight;
    let verticalOffset = Style.values.composeBarHeight;

    let top = screenHeight - height - verticalOffset;
    let left = screenWidth - width;
    let verticalMidpoint = top + height / 2 + 6;
    let horizontalMidpoint = left + width / 2 + 6;

    let topValue = this.state.animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [screenHeight - verticalOffset, top]
    });

    let verticalMidpointValue = this.state.animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [screenHeight - verticalOffset, verticalMidpoint]
    });

    let handleBase = {
      position: "absolute",
      opacity: this.state.animatedOpacity
    };

    let handleStyles = {
      horizontal: {
        ...handleBase,
        top: verticalMidpointValue,
        left: left
      },
      vertical: {
        ...handleBase,
        top: topValue,
        left: horizontalMidpoint
      },
      diagonal: {
        ...handleBase,
        top: topValue,
        left: left
      }
    };

    let handles = ["horizontal", "vertical", "diagonal"];

    return handles.map(handle => (
      <DragHandle
        key={`${handle}-handle`}
        style={handleStyles[handle]}
        ref={`${handle}Handle`}
        onDragMove={this.onDragHandle.bind(this, handle)}
        onDragStop={this.onDragStop}
      />
    ));
  }

  shouldShowHandles = () => {
    return this.props.screenFocusState === "focused";
  };

  onDragHandle = (axis, e) => {
    const statusBarHeight = getStatusBarHeight();
    let screenWidth = Dimensions.get("window").width;
    let screenHeight = Dimensions.get("window").height;
    let nextState = {};

    if (axis === "vertical" || axis === "diagonal") {
      nextState.workingHeight = constrain(
        screenHeight -
          e.nativeEvent.pageY -
          Style.values.rowHeight -
          statusBarHeight,
        MIN_MESSAGE_HEIGHT,
        MAX_MESSAGE_HEIGHT
      );
    }

    if (axis === "horizontal" || axis === "diagonal") {
      nextState.workingWidth = constrain(
        screenWidth - e.nativeEvent.pageX,
        MIN_MESSAGE_WIDTH,
        screenWidth
      );
    }

    this.setState(nextState);
  };

  onDragStop = () => {
    this.props.dispatch(
      updateWorkingMessage(this.props.message, {
        color:
          this.props.type === "picture"
            ? this.props.color
            : this.state.workingColor,
        height: this.state.workingHeight,
        width: this.state.workingWidth
      })
    );
  };

  onColorChange = color => {
    this.setState({
      workingColor: color
    });

    this.props.dispatch(
      updateWorkingMessage(this.props.message, {
        color: color
      })
    );
  };
}

let style = Style.create({
  message: {
    flex: 0,
    overflow: "hidden"
  },
  photoMessage: {
    borderTopLeftRadius: 1000,
    borderBottomLeftRadius: 1000
  }
});

let selectData = (state, props) => {
  return {
    messageCount: state.messages.length,
    composing: state.ui.conversation.composing
  };
};

export default withScreenFocusState(connect(selectData)(EditableMessage));
