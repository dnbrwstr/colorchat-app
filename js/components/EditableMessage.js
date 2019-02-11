import React from "react";
import {
  View,
  Dimensions,
  Animated
} from "react-native";
import { connect } from "react-redux";
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import Style from "../style";
import DragHandle from "./DragHandle";
import { updateWorkingMessage } from "../actions/MessageActions";
import SimpleColorPicker from "./SimpleColorPicker";
import { constrain } from "../lib/Utils";
import { withScreenFocusState } from "./ScreenFocusState";

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

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState !== this.state ||
      nextProps.composing !== this.props.composing ||
      nextProps.screenFocusState !== this.props.screenFocusState
    );
  }

  componentDidUpdate(prevProps) {
    let stoppedComposing = prevProps.composing && !this.props.composing;

    const wasBlurred =
      prevProps.screenFocusState === "blurring" ||
      prevProps.screenFocusState === "blurred";

    const isBlurred =
      this.props.screenFocusState === "blurring" ||
      this.props.screenFocusState === "blurred";

    let navigatedAway = !wasBlurred && isBlurred;

    let navigatedBack = wasBlurred && !isBlurred;
    if (stoppedComposing || navigatedAway) {
      this.state.animatedOpacity.setValue(0);
    } else if (navigatedBack) {
      Animated.timing(this.state.animatedOpacity, {
        toValue: 1,
        duration: 200
      }).start();
    }
  }

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

  render() {
    let messageStyle = this.shouldShowHandles()
      ? {
          width: this.state.workingWidth,
          height: this.state.animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, this.state.workingHeight]
          }),
          backgroundColor: this.state.workingColor
        }
      : {
          width: this.props.width,
          height: this.props.height,
          backgroundColor: this.props.color
        };

    let messageStyles = [
      {
        ...messageStyle,
        overflow: "visible",
        alignSelf: "flex-end"
      }
    ];

    const statusBarHeight = getStatusBarHeight();
    let screenWidth = Dimensions.get("window").width;
    let screenHeight = Dimensions.get("window").height - statusBarHeight;
    let width = this.state.workingWidth;
    let height = this.state.workingHeight;
    let verticalOffset = Style.values.rowHeight;

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

    // Render instructions if this is the first
    // message created & it hasn't yet been modified
    let shouldShowInstructions = this.props.messageCount === 1;

    return (
      <Animated.View style={messageStyles}>
        {this.shouldShowHandles() && (
          <View style={{ flex: 1 }}>
            <SimpleColorPicker
              showInstructions={shouldShowInstructions}
              style={{ flex: 1 }}
              onChange={this.onColorChange}
              initialValue={this.state.workingColor}
            />
            {handles.map(handle => (
              <DragHandle
                key={`${handle}-handle`}
                style={handleStyles[handle]}
                ref={`${handle}Handle`}
                onDragMove={this.onDragHandle.bind(this, handle)}
                onDragStop={this.onDragStop}
              />
            ))}
          </View>
        )}
      </Animated.View>
    );
  }

  shouldShowHandles = () => {
    return (
      this.props.composing &&
      this.props.state === "composing" &&
      this.props.screenFocusState === "focused"
    );
  };

  onDragHandle = (axis, e) => {
    const statusBarHeight = getStatusBarHeight();
    let screenWidth = Dimensions.get("window").width;
    let screenHeight = Dimensions.get("window").height;
    let nextState = {};

    if (axis === "vertical" || axis === "diagonal") {
      nextState.workingHeight = constrain(
        screenHeight - e.nativeEvent.pageY - Style.values.rowHeight - statusBarHeight,
        MIN_MESSAGE_HEIGHT,
        MAX_MESSAGE_HEIGHT
      );
    }

    if (axis === "horizontal" || axis === "diagonal") {
      nextState.workingWidth = constrain(
        screenWidth - e.nativeEvent.pageX,
        MIN_MESSAGE_WIDTH,
        MAX_MESSAGE_WIDTH
      );
    }

    this.setState(nextState);
  };

  onDragStop = () => {
    this.props.dispatch(
      updateWorkingMessage(this.props.message, {
        color: this.state.workingColor,
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
  message: {}
});

let selectData = (state, props) => {
  return {
    messageCount: state.messages.length,
    composing: state.ui.conversation.composing
  };
};

export default withScreenFocusState(connect(selectData)(EditableMessage));
