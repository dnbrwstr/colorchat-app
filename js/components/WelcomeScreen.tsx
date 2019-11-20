import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import Style from '../style';
import PressableView from './PressableView';
import config from '../config';
import {rand} from '../lib/Utils';
import BaseText from './BaseText';
import {navigateTo} from '../store/navigation/actions';
import withStyles, {InjectedStyles, makeStyleCreator} from '../lib/withStyles';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {getFocusStateChange} from '../lib/NavigationUtils';
import {
  withScreenFocusState,
  withScreenFocusStateProvider,
  FocusState,
  withOwnFocusState,
} from './ScreenFocusState';
import {AppDispatch} from '../store/createStore';
import {Theme} from '../style/themes';

const {appName} = config;

interface WelcomeScreenProps {
  screenFocusState: FocusState;
  styles: InjectedStyles<typeof getStyles>;
  dispatch: AppDispatch;
}

class WelcomeScreen extends Component<WelcomeScreenProps> {
  timer?: number;

  componentDidUpdate(prevProps: WelcomeScreenProps) {
    const change = getFocusStateChange(
      prevProps.screenFocusState,
      this.props.screenFocusState,
    );

    if (change.entered) {
      this.timer = setInterval(() => {
        this.setState({});
      }, 1000);
    } else if (change.exited) {
      this.timer && clearInterval(this.timer);
    }
  }

  randomColor() {
    return `hsl(${rand(360)},100%,65%)`;
  }

  render() {
    const {styles} = this.props;
    return (
      <View style={styles.wrapper}>
        <View style={styles.titleContainer}>
          <BaseText style={styles.title}>{appName}</BaseText>
        </View>

        <View style={styles.floatMessageContainer}>
          <View style={styles.floatMessage}>
            <Text style={styles.floatMessageText}>
              {this.renderColorizedText('Chat with')}
              {'\n'}
              {this.renderColorizedText('colors instead')}
              {'\n'}
              {this.renderColorizedText('of words')}
            </Text>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <PressableView
            style={styles.bottomBarButton}
            onPress={this.handlePressNext}
          >
            <BaseText style={styles.bottomBarButtonText}>Setup</BaseText>
          </PressableView>
        </View>
      </View>
    );
  }

  renderColorizedText(text: string) {
    return text.split('').map((letter: string, i: number) => {
      return (
        <Text key={`letter-${i}`} style={{color: this.randomColor()}}>
          {letter}
        </Text>
      );
    });
  }

  handlePressNext = () => {
    this.props.dispatch(navigateTo('signup'));
  };
}

const getStyles = makeStyleCreator((theme: Theme) => ({
  wrapper: {
    ...Style.mixins.outerWrapperBase,
    backgroundColor: theme.backgroundColor,
    flex: 1,
  },
  welcome: {
    flex: 1,
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Style.values.rowHeight,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.primaryTextColor,
    padding: 20,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    ...ifIphoneX({bottom: 30}, {}),
    left: 0,
    right: 0,
    height: Style.values.rowHeight,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  bottomBarButton: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomBarButtonText: {
    color: theme.primaryTextColor,
    textAlign: 'center',
  },
  floatMessageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  floatMessage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  floatMessageText: {
    ...Style.mixins.textBase,
    color: theme.primaryTextColor,
    textAlign: 'center',
    lineHeight: 24,
  },
}));

const selector = () => ({});

export default connect(selector)(
  withStyles(getStyles)(withOwnFocusState(WelcomeScreen)),
);
