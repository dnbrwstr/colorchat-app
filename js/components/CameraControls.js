import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  StatusBar
} from "react-native";
import CameraMenu from "./CameraDisplayModeMenu";
import withStyles from "../lib/withStyles";

class CameraControls extends Component {
  state = {
    cameraPosition: "back",
    whiteBalanceMode: "auto",
    exposureMode: "auto",
    recording: true
  };

  render() {
    const { styles } = this.props;
    return (
      <View style={styles.controls}>
        <CameraMenu
          initialValue={this.props.displayMode}
          onChange={this.props.onDisplayModeChange}
        />
        <View style={styles.recordBar}>
          <TouchableWithoutFeedback onPress={this.handleToggleCamera}>
            <View style={styles.recordBarSideButton} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPressIn={this.handleStartRecording}
            onPressOut={this.handleStopRecording}
          >
            <View style={styles.recordButton}>
              <View style={styles.recordButtonInner} />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <View style={styles.recordBarSideButton}>
              {this.props.renderCamera && this.props.renderCamera()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  handleToggleCamera = () => {
    const nextCameraPosition =
      this.state.cameraPosition === "front" ? "back" : "front";

    this.setState({
      cameraPosition: nextCameraPosition
    });
  };

  handleStartRecording = () => {
    this.setState({ recording: true });
  };

  handleStopRecording = () => {
    this.setState({ recording: false });
  };

  handleTogglePreview = () => {
    this.setState({
      showPreview: !this.state.showPreview
    });
  };

  handleToggleExposureMode = () => {
    this.setState({
      exposureMode: this.state.exposureMode === "auto" ? "locked" : "auto"
    });
  };

  handleToggleWhiteBalanceMode = () => {
    this.setState({
      whiteBalanceMode:
        this.state.whiteBalanceMode === "auto" ? "locked" : "auto"
    });
  };
}

const getStyles = theme => ({
  controls: {
    paddingBottom: 20,
    justifyContent: "center"
  },
  recordBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexGrow: 1,
    flexShrink: 0,
    paddingHorizontal: 20
  },
  recordBarSideButton: {
    aspectRatio: 1,
    backgroundColor: "#666666",
    borderRadius: 1000,
    overflow: "hidden"
  },
  recordButton: {
    width: 68,
    height: 68,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 1000,
    backgroundColor: "white"
  },
  recordButtonInner: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderWidth: 2,
    borderRadius: 100
  }
});

export default withStyles(getStyles)(CameraControls);
