import React, {Component, ReactNode} from 'react';
import {View, ScrollView, KeyboardAvoidingView} from 'react-native';
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

  render() {
    const {props} = this;
    const {theme, styles} = props;
    return (
      <KeyboardAvoidingView
        behavior={'height'}
        style={styles.wrapper}
        keyboardVerticalOffset={getStatusBarHeight()}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={this.props.scrollEnabled}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={'handled'}
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
