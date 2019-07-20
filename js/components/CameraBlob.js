import React, { Component } from "react";
import { Animated, Platform } from "react-native";
import ColorCamera from "react-native-color-camera";
import PressableBlob from "./PressableBlob";
import { withScreenFocusState } from "./ScreenFocusState";
import withStyles from "../lib/withStyles";

const AnimatedColorCamera = Animated.createAnimatedComponent(ColorCamera);

const initialColor = Platform.OS === "android" ? 0 : 1;

class CameraBlob extends Component {
  cameraColor = new Animated.Value(initialColor);
  cameraRotation = new Animated.Value(0);

  state = {
    hasEntered: false
  };

  constructor(props) {
    super(props);
    this.state = {
      hasEntered: false,
      location: props.location
    };
  }

  componentDidMount() {
    this.maybeEnter();
  }

  componentDidUpdate(prevProps, prevState) {
    this.maybeEnter();

    if (this.props.location !== prevProps.location) {
      const nextLocation = this.props.location;
      Animated.parallel([
        Animated.timing(this.cameraColor, {
          toValue: 0,
          duration: 250
        }),
        Animated.timing(this.cameraRotation, {
          toValue: 1,
          useNativeDriver: true,
          duration: 300
        })
      ]).start(() => {
        this.cameraRotation.setValue(0);
        this.setState({
          location: nextLocation
        });
        Animated.timing(this.cameraColor, {
          toValue: 1,
          delay: 200,
          duration: 300
        }).start();
      });
    }
  }

  maybeEnter() {
    // if (!this.state.hasEntered) {
    //   this.setState({ hasEntered: true });
    //   Animated.timing(this.cameraColor, {
    //     toValue: 1,
    //     timing: "linear"
    //   }).start();
    // }
  }

  render() {
    const { theme, styles, style } = this.props;

    const rotation = this.cameraRotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"]
    });

    const rotationStyle = {
      transform: [{ rotateY: rotation }]
    };

    const color = this.cameraColor.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.defaultAvatarColor, "transparent"]
    });

    const colorStyle = { backgroundColor: color };

    return (
      <PressableBlob
        onPress={this.props.onPress}
        style={[styles.cameraContainer, rotationStyle, style]}
        key="camera"
      >
        <AnimatedColorCamera
          style={[styles.camera]}
          onColorChange={this.props.onColorChange}
          eventInterval={this.props.eventInterval}
          location={this.state.location}
          analysisMethod={"dominant"}
          showPreview={true}
          onReady={this.handleCameraReady}
        />
        <Animated.View style={[styles.cover, colorStyle]} />
      </PressableBlob>
    );
  }

  handleCameraReady = () => {
    if (Platform.OS === "android") {
      Animated.timing(this.cameraColor, {
        toValue: 1,
        timing: "linear"
      }).start();
    }
  };

  handlePressCamera = () => {
    Animated.parallel([
      Animated.timing(this.cameraColor, {
        toValue: 1,
        duration: 500
      }),
      Animated.timing(this.cameraRotation, {
        toValue: 1,
        useNativeDriver: true,
        duration: 500
      })
    ]).start(() => {
      this.cameraRotation.setValue(0);
      this.setState({
        cameraLocation: nextLocation
      });
      Animated.timing(this.cameraColor, {
        toValue: 0,
        delay: 0,
        duration: 500
      }).start();
    });
  };
}

const getStyles = theme => ({
  cameraContainer: {
    borderRadius: 1000,
    overflow: "hidden",
    backgroundColor: "black"
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  cover: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
});

export default withStyles(getStyles)(withScreenFocusState(CameraBlob));
