import React, {Component, ReactNode} from 'react';
import {View, Animated} from 'react-native';
import withStyles, {InjectedStyles, makeStyleCreator} from '../lib/withStyles';
import AnimatedColorDisplay from './AnimatedColorDisplay';
import GridColorDisplay from './GridColorDisplay';
import SingleColorDisplay from './SingleColorDisplay';
import {DisplayMode} from './CameraDisplayModeMenu';
import {Theme} from '../style/themes';
import {DetectedColor} from 'react-native-color-camera';

interface CameraDisplayProps {
  displayMode: DisplayMode;
  styles: InjectedStyles<typeof getStyles>;
  colors?: DetectedColor[];
  onSelectColor: (color: DetectedColor) => void;
}

interface CameraDisplayState {
  displayMode: DisplayMode;
}

class CameraDisplay extends Component<CameraDisplayProps, CameraDisplayState> {
  displayOpacity = new Animated.Value(1);
  animation?: Animated.CompositeAnimation;

  constructor(props: CameraDisplayProps) {
    super(props);

    this.state = {
      displayMode: props.displayMode,
    };
  }

  componentDidUpdate(
    prevProps: CameraDisplayProps,
    prevState: CameraDisplayState,
  ) {
    const displayModeChanged = prevProps.displayMode !== this.props.displayMode;
    if (displayModeChanged) this.setDisplayMode(this.props.displayMode);
  }

  setDisplayMode(mode: DisplayMode) {
    if (this.animation) this.animation.stop();
    this.animation = Animated.timing(this.displayOpacity, {
      toValue: 0,
    });
    this.animation.start(({finished}) => {
      if (!finished) return;
      this.setState({
        displayMode: this.props.displayMode,
      });
      this.animation = Animated.timing(this.displayOpacity, {
        toValue: 1,
      });
      this.animation.start();
    });
  }

  render() {
    const {styles} = this.props;
    const opacityStyle = {
      opacity: this.displayOpacity,
    };
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.content, opacityStyle]}>
          <AnimatedColorDisplay
            colors={this.props.colors}
            displayMode={this.state.displayMode}
          >
            {colorProps => {
              return this.state.displayMode === 'grid' ? (
                <GridColorDisplay
                  {...colorProps}
                  onSelectColor={this.props.onSelectColor}
                />
              ) : (
                <SingleColorDisplay
                  {...colorProps}
                  onSelectColor={this.props.onSelectColor}
                />
              );
            }}
          </AnimatedColorDisplay>
        </Animated.View>
      </View>
    );
  }
}

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
}));

export default withStyles(getStyles)(CameraDisplay);
