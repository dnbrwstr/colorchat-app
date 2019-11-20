import React, {Component, ReactNode} from 'react';
import {View, TouchableWithoutFeedback, Animated} from 'react-native';
import CameraMenu, {DisplayMode} from './CameraDisplayModeMenu';
import withStyles, {makeStyleCreator, InjectedStyles} from '../lib/withStyles';
import {Theme} from '../style/themes';

interface CameraControlsProps {
  styles: InjectedStyles<typeof getStyles>;
  displayMode: DisplayMode;
  onDisplayModeChange: () => void;
  renderCamera: () => ReactNode;
}

interface CameraControlsState {
  cameraPosition: 'front' | 'back';
  whiteBalanceMode: string;
  exposureMode: string;
  recording: boolean;
  showPreview: boolean;
}

class CameraControls extends Component<
  CameraControlsProps,
  CameraControlsState
> {
  recordBarSize = new Animated.Value(1);
  recordBarStyle = this.recordBarSize.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 68],
  });

  containerStyle = {
    paddingBottom: this.recordBarSize.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 20],
    }),
  };

  state: CameraControlsState = {
    cameraPosition: 'back',
    whiteBalanceMode: 'auto',
    exposureMode: 'auto',
    recording: true,
    showPreview: true,
  };

  render() {
    const {styles} = this.props;
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
      this.state.cameraPosition === 'front' ? 'back' : 'front';

    this.setState({
      cameraPosition: nextCameraPosition,
    });
  };

  handleStartRecording = () => {
    this.setState({recording: true});
  };

  handleStopRecording = () => {
    this.setState({recording: false});
  };

  handleTogglePreview = () => {
    this.setState({
      showPreview: !this.state.showPreview,
    });
  };

  handleToggleExposureMode = () => {
    this.setState({
      exposureMode: this.state.exposureMode === 'auto' ? 'locked' : 'auto',
    });
  };

  handleToggleWhiteBalanceMode = () => {
    this.setState({
      whiteBalanceMode:
        this.state.whiteBalanceMode === 'auto' ? 'locked' : 'auto',
    });
  };
}

const getStyles = makeStyleCreator((theme: Theme) => ({
  controls: {
    justifyContent: 'center',
  },
  recordBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
    flexShrink: 0,
    paddingHorizontal: 20,
    // paddingBottom: 20
  },
  recordBarSideButton: {
    aspectRatio: 1,
    backgroundColor: '#666666',
    borderRadius: 1000,
    overflow: 'hidden',
  },
  recordButton: {
    width: 68,
    height: 68,
    borderRadius: 1000,
    backgroundColor: theme.primaryButtonColor,
  },
  recordButtonInner: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderWidth: 2,
    borderColor: theme.backgroundColor,
    borderRadius: 100,
  },
}));

export default withStyles(getStyles)(CameraControls);
