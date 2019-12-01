import React, {Component, ReactNode} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  EmitterSubscription,
} from 'react-native';
import Style from '../style';
import Header from './Header';
import withStyles, {makeStyleCreator, InjectedStyles} from '../lib/withStyles';
import {ifIphoneX, getStatusBarHeight} from 'react-native-iphone-x-helper';
import {Theme} from '../style/themes';

interface SignupScreenProps {
  title: string;
  theme: Theme;
  styles: InjectedStyles<typeof getStyles>;
  scrollEnabled?: boolean;
  hideBackButton?: boolean;
  renderNextButton: () => ReactNode;
  onNavigateBack?: () => void;
}

interface SignupScreenState {
  keyboardAvoidingViewKeyCounter: number;
}

class SignupScreen extends Component<SignupScreenProps, SignupScreenState> {
  static defaultProps = {scrollEnabled: true};

  state: SignupScreenState = {
    keyboardAvoidingViewKeyCounter: 0,
  };

  keyboardHideListener?: EmitterSubscription;

  componentDidMount() {
    this.keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      this.handleKeyboardHidden,
    );
  }

  componentWillUnmount() {
    this.keyboardHideListener?.remove();
  }

  render() {
    const {props} = this;
    const {theme, styles} = props;
    return (
      <KeyboardAvoidingView
        key={`kav-${this.state.keyboardAvoidingViewKeyCounter}`}
        behavior={Platform.OS === 'ios' ? 'height' : undefined}
        style={styles.wrapper}
        keyboardVerticalOffset={getStatusBarHeight()}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={this.props.scrollEnabled}
        >
          <View style={styles.content}>
            <Header
              onPressBack={props.onNavigateBack}
              showBorder={false}
              hideBackButton={props.hideBackButton}
            >
              {props.title}
            </Header>

            <View style={styles.screenContent}>
              <View style={styles.screenContentInner}>{props.children}</View>
            </View>
          </View>
          <View>{props.renderNextButton()}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  handleKeyboardHidden = () => {
    this.setState({
      keyboardAvoidingViewKeyCounter:
        this.state.keyboardAvoidingViewKeyCounter + 1,
    });
  };
}

const getStyles = makeStyleCreator((theme: Theme) => ({
  wrapper: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  scroll: {flexGrow: 1},
  scrollContent: {
    flexGrow: 1,
    ...ifIphoneX({paddingBottom: 30}, {}),
  },
  content: {
    flex: 1,
    flexShrink: 0,
  },
  screenContent: {
    ...Style.mixins.contentWrapperBase,
    paddingTop: 0,
    flexShrink: 0,
  },
  screenContentInner: {
    paddingBottom: 22,
    flexShrink: 0,
  },
}));

export default withStyles(getStyles)(SignupScreen);
