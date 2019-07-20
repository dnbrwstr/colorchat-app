import React, { Component } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import Color from "color";
import ColorCamera from "react-native-color-camera";
import { connectWithStyles } from "../lib/withStyles";
import { withScreenFocusStateProvider } from "./ScreenFocusState";
import CameraDisplay from "./CameraDisplay";
import CameraBlob from "./CameraBlob";
import { navigateBack } from "../actions/NavigationActions";
import { updateWorkingMessage } from "../actions/MessageActions";
import CameraControls from "./CameraControls";
const interval = 250;

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
      <View style={styles.container}>
        <Animated.View style={{ flex: 1, opacity: this.cameraOpacity }}>
          <CameraDisplay
            colors={this.state.colors}
            displayMode={this.state.displayMode}
            renderCamera={this.renderGridCamera}
            animationLength={interval}
            focusState={screenFocusState}
            onSelectColor={this.handleSelectColor}
            onPressClose={this.handlePressClose}
          />
        </Animated.View>
        {/* <CameraControls
          focusState={screenFocusState}
          renderCamera={this.renderControlsCamera}
          displayMode={this.state.displayMode}
          onDisplayModeChange={this.handleDisplayModeChange}
        /> */}
      </View>
    );
  }

  renderGridCamera = () => {
    return (
      <CameraBlob
        style={{
          height: 100,
          aspectRatio: 1
        }}
        onPress={this.handleCameraPress}
        requestPermission={true}
        onReady={this.handleCameraReady}
        onColorChange={this.handleColorChange}
        eventInterval={interval / 1000}
        location={this.state.cameraLocation}
      />
    );
  };

  renderControlsCamera = () => {
    return (
      <ColorCamera
        style={{ flex: 1, flexBasis: 100, backgroundColor: "red" }}
        requestPermission={true}
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

  handlePressClose = () => {
    this.props.dispatch(navigateBack());
  };

  handleSelectColor = color => {
    this.props.dispatch(
      updateWorkingMessage(this.props.message, {
        type: "picture",
        color: Color(color).hexString(),
        recipientId: this.props.contactId
      })
    );
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
