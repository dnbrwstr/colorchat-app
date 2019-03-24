import React, { Component } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import Color from "color";
import { connectWithStyles } from "../lib/withStyles";
import { withScreenFocusStateProvider } from "./ScreenFocusState";
import CameraDisplay from "./CameraDisplay";
import CameraBlob from "./CameraBlob";
import { navigateBack } from "../actions/NavigationActions";
import { updateWorkingMessage } from "../actions/MessageActions";

const interval = 1000;

class CameraScreen extends Component {
  state = {
    displayMode: "grid",
    cameraLocation: "back"
  };

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.cameraVisible && this.state.cameraReady) {
      Animated.timing(this.cameraOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear
      }).start();
      this.setState({ cameraVisible: true });
    }
  }

  render() {
    const { styles, screenFocusState } = this.props;
    return (
      <View style={[styles.container]}>
        <CameraDisplay
          colors={this.state.colors}
          displayMode={this.state.displayMode}
          animationLength={interval}
          renderCamera={this.renderCamera}
          focusState={screenFocusState}
          onSelectColor={this.handleSelectColor}
        />
      </View>
    );
  }

  renderCamera = () => {
    return (
      <CameraBlob
        onPress={this.handleCameraPress}
        onReady={this.handleCameraReady}
        onColorChange={this.handleColorChange}
        eventInterval={interval / 1000}
        location={this.state.cameraLocation}
      />
    );
  };

  handleCameraPress = () => {
    const cameraLocation =
      this.state.cameraLocation === "back" ? "front" : "back";
    this.setState({ cameraLocation });
  };

  handleColorChange = ({ nativeEvent: { colors } }) => {
    this.setState({ colors });
  };

  handleDisplayModeChange = displayMode => {
    this.setState({ displayMode });
  };

  handleSelectColor = color => {
    this.props.dispatch(
      updateWorkingMessage(this.props.message, {
        type: "picture",
        color: Color(color).hexString(),
        recipientId: this.props.contactId
      })
    );
    this.props.dispatch(navigateBack());
  };
}

const getStyles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  emptyMessageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyMessage: {
    textAlign: "center",
    color: theme.secondaryTextColor
  }
});

export default withScreenFocusStateProvider(
  connectWithStyles(getStyles, state => ({
    contactId: state.ui.conversation.contactId,
    message: state.messages.working.find(m => {
      return m.recipientId === state.ui.conversation.contactId;
    })
  }))(CameraScreen)
);
