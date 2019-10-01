import React, {Component} from 'react';
import {View, Animated, Easing} from 'react-native';
import Color from 'color';
import Style from '../style';
import CameraMenu from './CameraDisplayModeMenu';
import PressableView from './PressableView';
import Text from './BaseText';
import {connectWithStyles} from '../lib/withStyles';
import {withScreenFocusStateProvider} from './ScreenFocusState';
import CameraDisplay from './CameraDisplay';
import CameraBlob from './CameraBlob';
import {navigateBack} from '../store/navigation/actions';
import {updateWorkingMessage} from '../store/messages/actions';
import GradientMask from './GradientMask';
import {ifIphoneX} from 'react-native-iphone-x-helper';
const interval = 250;

class CameraScreen extends Component {
  state = {
    displayMode: 'grid',
    cameraLocation: 'back',
  };

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.cameraVisible && this.state.cameraReady) {
      Animated.timing(this.cameraOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
      }).start();
      this.setState({cameraVisible: true});
    }
  }

  render() {
    const {theme, styles, screenFocusState} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.instructionText}>Tap to select a color</Text>
          <PressableView
            style={styles.doneButton}
            onPress={this.handlePressDone}
          >
            <Text style={styles.doneText}>Done</Text>
          </PressableView>
        </View>
        <Animated.View style={{flex: 1, opacity: this.cameraOpacity}}>
          <CameraDisplay
            colors={this.state.colors}
            displayMode={this.state.displayMode}
            animationLength={interval}
            focusState={screenFocusState}
            onSelectColor={this.handleSelectColor}
          />
        </Animated.View>
        <View style={styles.displayModeMenu}>
          <CameraMenu
            initialValue={this.state.displayMode}
            onChange={this.handleDisplayModeChange}
          />
          <GradientMask
            width={125}
            height={Style.values.rowHeight}
            fadeColor={theme.backgroundColor}
            style={styles.displayModeMenuMask}
          />
        </View>
        <View style={styles.cameraContainer}>
          <CameraBlob
            style={styles.camera}
            requestPermission={true}
            onReady={this.handleCameraReady}
            onColorChange={this.handleColorChange}
            eventInterval={interval / 1000}
            location={this.state.cameraLocation}
            onPress={this.handleCameraPress}
          />
        </View>
      </View>
    );
  }

  handleCameraPress = () => {
    const cameraLocation =
      this.state.cameraLocation === 'back' ? 'front' : 'back';
    this.setState({cameraLocation});
  };

  handleColorChange = ({nativeEvent: {colors}}) => {
    this.setState({colors});
  };

  handleDisplayModeChange = displayMode => {
    this.setState({displayMode});
  };

  handlePressDone = () => {
    this.props.dispatch(navigateBack());
  };

  handleSelectColor = color => {
    this.props.dispatch(navigateBack());
    this.props.dispatch(
      updateWorkingMessage(this.props.message, {
        type: 'picture',
        color: Color(color).hex(),
        recipientId: this.props.contactId,
      }),
    );
  };
}

const getStyles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  header: {
    height: Style.values.rowHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
  },
  instructionText: {
    color: theme.secondaryTextColor,
  },
  doneButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  doneText: {
    color: theme.primaryTextColor,
  },
  emptyMessageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    color: theme.secondaryTextColor,
  },
  cameraContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    bottom: Style.values.rowHeight - 40 + 4 + ifIphoneX(20, 0),
    right: 15,
    overflow: 'hidden',
    borderRadius: 1000,
  },
  camera: {
    flex: 1,
  },
  displayModeMenu: {
    height: Style.values.rowHeight,
    paddingBottom: ifIphoneX(20, 0),
  },
  displayModeMenuMask: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
  },
});

export default withScreenFocusStateProvider(
  connectWithStyles(getStyles, state => ({
    contactId: state.ui.conversation.contactId,
    message: state.messages.working.find(m => {
      return m.recipientId === state.ui.conversation.contactId;
    }),
  }))(CameraScreen),
);
