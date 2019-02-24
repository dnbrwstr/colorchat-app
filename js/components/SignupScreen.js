import React from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import Style from "../style";
import Header from "./Header";
import withStyles from "../lib/withStyles";

const SignupScreen = props => {
  const { theme, styles } = props;

  return (
    <View style={styles.wrapper}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={props.scrollEnabled}
      >
        <View style={styles.content}>
          <Header
            title={props.title}
            showBack={!!props.onNavigateBack}
            onBack={props.onNavigateBack}
          />

          <View style={styles.screenContent}>
            <View style={styles.screenContentInner}>{props.children}</View>
          </View>

          <View>{props.renderNextButton()}</View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

SignupScreen.defaultProps = { scrollEnabled: true };

let getStyles = theme => ({
  wrapper: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1
  },
  screenContent: {
    ...Style.mixins.contentWrapperBase,
    paddingTop: 0,
    flex: 1
  },
  screenContentInner: {
    paddingBottom: 22
  }
});

export default withStyles(getStyles)(SignupScreen);
