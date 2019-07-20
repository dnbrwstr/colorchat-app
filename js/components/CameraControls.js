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

  constructor(props) {
    super(props);

    // const recordBarSize = props.displayMode === "grid" ? 0 : 1;
    const recordBarSize = 1;
    this.recordBarSize = new Animated.Value(recordBarSize);

    this.recordBarStyle = {
      height: this.recordBarSize.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 68]
      })
    };

    this.containerStyle = {
      paddingBottom: this.recordBarSize.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20]
      })
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // const isGrid = this.props.displayMode === "grid";
    // const wasGrid = prevProps.displayMode === "grid";
    // const changedToGrid = isGrid && !wasGrid;
    // const changedFromGrid = !isGrid && wasGrid;
    // if (changedToGrid || changedFromGrid) {
    //   if (this.animation) this.animation.stop();
    //   const nextValue = isGrid ? 0 : 1;
    //   this.animation = Animated.timing(this.recordBarSize, {
    //     toValue: nextValue
    //   });
    //   this.animation.start();
    // }
  }

  render() {
    const { styles } = this.props;
    return (
      <Animated.View style={[styles.controls, this.containerStyle]}>
        <CameraMenu
          initialValue={this.props.displayMode}
          onChange={this.props.onDisplayModeChange}
        />
        <Animated.View style={[styles.recordBar, this.recordBarStyle]}>
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
        </Animated.View>
      </Animated.View>
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
    justifyContent: "center"
  },
  recordBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexGrow: 1,
    flexShrink: 0,
    paddingHorizontal: 20
    // paddingBottom: 20
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
    borderRadius: 1000,
    backgroundColor: theme.primaryButtonColor
  },
  recordButtonInner: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderWidth: 2,
    borderColor: theme.backgroundColor,
    borderRadius: 100
  }
});

export default withStyles(getStyles)(CameraControls);
