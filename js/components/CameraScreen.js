import React, { Component } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import ColorCamera from "react-native-color-camera";
import { connectWithStyles } from "../lib/withStyles";
import {
  withScreenFocusState,
  withScreenFocusStateProvider
} from "./ScreenFocusState";
import CameraDisplay from "./CameraDisplay";
import CameraControls from "./CameraControls";

const interval = 500;

class CameraScreen extends Component {
  state = {
    displayMode: "grid"
  };

  cameraOpacity = new Animated.Value(0.001);

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
            animationLength={interval}
          />
        </Animated.View>
        <CameraControls
          focusState={screenFocusState}
          renderCamera={this.renderCamera}
          displayMode={this.state.displayMode}
          onDisplayModeChange={this.handleDisplayModeChange}
        />
      </View>
    );
  }

  renderCamera = () => {
    console.log(this.props.screenFocusState);
    if (this.props.screenFocusState !== "focused") return null;
    return (
      <ColorCamera
        style={{ flex: 1 }}
        requestPermission={true}
        onReady={this.handleCameraReady}
        onColorChange={this.handleColorChange}
        eventInterval={interval / 1000}
      />
    );
  };

  handleCameraReady = () => {
    this.setState({ cameraReady: true });
  };

  handleColorChange = ({ nativeEvent: { colors } }) => {
    this.setState({ colors });
  };

  handleDisplayModeChange = displayMode => {
    this.setState({ displayMode });
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
  withScreenFocusState(connectWithStyles(getStyles, () => ({}))(CameraScreen))
);
