import React, {Component} from 'react';
import {View, Animated, Easing} from 'react-native';
import Color from 'color';
import Style from '../style';
import CameraMenu, {DisplayMode} from './CameraDisplayModeMenu';
import PressableView from './PressableView';
import Text from './BaseText';
import withStyles, {InjectedStyles, makeStyleCreator} from '../lib/withStyles';
import {withScreenFocusStateProvider, FocusState} from './ScreenFocusState';
import CameraDisplay from './CameraDisplay';
import CameraBlob from './CameraBlob';
import {navigateBack} from '../store/navigation/actions';
import {updateWorkingMessage} from '../store/messages/actions';
import GradientMask from './GradientMask';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {
  CameraLocation,
  CameraColorChangeEvent,
  CameraColor,
} from '../lib/CameraTypes';
import {Theme} from '../style/themes';
import {Message, MessageType} from '../store/messages/types';
import {connect} from 'react-redux';
import {AppDispatch, AppState} from '../store/createStore';

const interval = 250;

interface CameraScreenProps {
  theme: Theme;
  styles: InjectedStyles<typeof getStyles>;
  screenFocusState: FocusState;
  contactId: number | null;
  message?: Message;
  dispatch: AppDispatch;
}

interface CameraScreenState {
  colors: CameraColor[];
  cameraVisible: boolean;
  cameraReady: boolean;
  displayMode: DisplayMode;
  cameraLocation: CameraLocation;
}

class CameraScreen extends Component<CameraScreenProps, CameraScreenState> {
  cameraOpacity = new Animated.Value(1);

  state: CameraScreenState = {
    colors: [],
    cameraVisible: false,
    cameraReady: false,
    displayMode: 'grid',
    cameraLocation: 'back',
  };

  componentDidUpdate(
    prevProps: CameraScreenProps,
    prevState: CameraScreenState,
  ) {
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
            onColorChange={this.handleColorChange}
            eventInterval={interval / 1000}
            location={this.state.cameraLocation}
            onPress={this.handleCameraPress}
          />
        </View>
      </View>
    );
  }

  handleCameraReady = () => {
    // Nothing right now
  };

  handleCameraPress = () => {
    const cameraLocation =
      this.state.cameraLocation === 'back' ? 'front' : 'back';
    this.setState({cameraLocation});
  };

  handleColorChange = ({nativeEvent: {colors}}: CameraColorChangeEvent) => {
    this.setState({colors});
  };

  handleDisplayModeChange = (displayMode: DisplayMode) => {
    this.setState({displayMode});
  };

  handlePressDone = () => {
    this.props.dispatch(navigateBack());
  };

  handleSelectColor = (color: CameraColor) => {
    this.props.dispatch(navigateBack());
    this.props.message &&
      this.props.contactId !== null &&
      this.props.dispatch(
        updateWorkingMessage(this.props.message, {
          type: MessageType.Picture,
          color: Color(color).hex(),
          recipientId: this.props.contactId,
        }),
      );
  };
}

const getStyles = makeStyleCreator((theme: Theme) => ({
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
}));

const selector = (state: AppState) => ({
  contactId: state.ui.conversation.contactId,
  message: state.messages.working.find(m => {
    return m.recipientId === state.ui.conversation.contactId;
  }),
});

const addStyles = withStyles(getStyles);
const addProps = connect(selector);

export default withScreenFocusStateProvider(addStyles(addProps(CameraScreen)));
