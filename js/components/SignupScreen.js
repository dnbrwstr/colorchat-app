import React, { Component } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform
} from "react-native";
import Style from "../style";
import Header from "./Header";
import withStyles from "../lib/withStyles";
import { ifIphoneX, getStatusBarHeight } from "react-native-iphone-x-helper";

class SignupScreen extends Component {
  static defaultProps = { scrollEnabled: true };

  state = {
    keyboardAvoidingViewKeyCounter: 0
  };

  componentDidMount() {
    this.keyboardHideListener = Keyboard.addListener(
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide",
      this.handleKeyboardHidden
    );
  }

  componentWillUnmount() {
    this.keyboardHideListener.remove();
  }

  render() {
    const { props } = this;
    const { theme, styles } = props;
    return (
      <KeyboardAvoidingView
        key={`kav-${this.state.keyboardAvoidingViewKeyCounter}`}
        behavior={Platform.OS === "ios" && "height"}
        style={styles.wrapper}
        keyboardVerticalOffset={getStatusBarHeight()}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={this.props.scrollEnabled}
        >
          <View style={styles.content}>
            <Header title={props.title} onPressBack={props.onNavigateBack} />

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
        this.state.keyboardAvoidingViewKeyCounter + 1
    });
  };
}

let getStyles = theme => ({
  wrapper: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  scroll: { flexGrow: 1 },
  scrollContent: {
    flexGrow: 1,
    ...ifIphoneX({ paddingBottom: 30 })
  },
  content: {
    flex: 1,
    flexShrink: 0
  },
  screenContent: {
    ...Style.mixins.contentWrapperBase,
    paddingTop: 0,
    flexShrink: 0
  },
  screenContentInner: {
    paddingBottom: 22,
    flexShrink: 0
  }
});

export default withStyles(getStyles)(SignupScreen);
