import React, {Component} from 'react';
import {Animated, Platform, StyleProp, ViewStyle, Easing} from 'react-native';
import ColorCamera, {
  CameraLocation,
  DetectedColorChangeEvent,
} from 'react-native-color-camera';
import PressableBlob from './PressableBlob';
import withStyles, {InjectedStyles, makeStyleCreator} from '../lib/withStyles';
import {Theme} from '../style/themes';

const initialColor = Platform.OS === 'android' ? 0 : 1;

interface CameraBlobProps {
  location: CameraLocation;
  style: StyleProp<ViewStyle>;
  styles: InjectedStyles<typeof getStyles>;
  theme: Theme;
  onPress: () => void;
  onColorChange: (e: DetectedColorChangeEvent) => void;
  eventInterval: number;
}

interface CameraBlobState {
  hasEntered: boolean;
  location: CameraLocation;
}

class CameraBlob extends Component<CameraBlobProps, CameraBlobState> {
  cameraColor = new Animated.Value(initialColor);
  cameraRotation = new Animated.Value(0);

  constructor(props: CameraBlobProps) {
    super(props);
    this.state = {
      hasEntered: false,
      location: props.location,
    };
  }

  componentDidMount() {
    this.maybeEnter();
  }

  componentDidUpdate(prevProps: CameraBlobProps, prevState: CameraBlobState) {
    this.maybeEnter();

    if (this.props.location !== prevProps.location) {
      const nextLocation = this.props.location;
      Animated.parallel([
        Animated.timing(this.cameraColor, {
          toValue: 0,
          duration: 250,
        }),
        Animated.timing(this.cameraRotation, {
          toValue: 1,
          useNativeDriver: true,
          duration: 300,
        }),
      ]).start(() => {
        this.cameraRotation.setValue(0);
        this.setState({
          location: nextLocation,
        });
        Animated.timing(this.cameraColor, {
          toValue: 1,
          delay: 200,
          duration: 300,
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
    const {theme, styles, style} = this.props;

    const rotation = this.cameraRotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    const rotationStyle = ({
      transform: [{rotateY: rotation}],
    } as any) as ViewStyle;

    const color = this.cameraColor.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.defaultAvatarColor, 'transparent'],
    });

    const colorStyle = {backgroundColor: color};

    return (
      <PressableBlob
        onPress={this.props.onPress}
        style={[styles.cameraContainer, rotationStyle, style]}
        key="camera"
      >
        <ColorCamera
          style={styles.camera}
          onColorChange={this.props.onColorChange}
          eventInterval={this.props.eventInterval}
          location={this.state.location}
          analysisMethod={'dominant'}
          showPreview={true}
          onReady={this.handleCameraReady}
        />
        <Animated.View style={[styles.cover, colorStyle]} />
      </PressableBlob>
    );
  }

  handleCameraReady = () => {
    if (Platform.OS === 'android') {
      Animated.timing(this.cameraColor, {
        toValue: 1,
        easing: Easing.linear,
      }).start();
    }
  };
}

const getStyles = makeStyleCreator((theme: Theme) => ({
  cameraContainer: {
    borderRadius: 1000,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cover: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
}));

export default withStyles(getStyles)(CameraBlob);
