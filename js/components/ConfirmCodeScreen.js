import React from "react";
import { View, Keyboard, StyleSheet } from "react-native";
import { connect } from "react-redux";
import Style from "../style";
import LoaderButton from "./LoaderButton";
import ErrorMessage from "./ErrorMessage";
import SignupScreen from "./SignupScreen";
import BaseTextInput from "./BaseTextInput";
import { navigateTo } from "../actions/NavigationActions";
import {
  submitConfirmationCode,
  updateData,
  clearConfirmCodeError
} from "../actions/SignupActions";
import { confirmationCodeScreenSelector } from "../lib/Selectors";
import withStyles from "../lib/withStyles";

class ConfirmCodeScreen extends React.Component {
  render() {
    let { dispatch, error, theme, styles } = this.props;

    return (
      <SignupScreen
        title="Confirm code"
        onNavigateBack={() => dispatch(navigateTo("signup"))}
        renderNextButton={this.renderNextButton}
      >
        {error ? (
          <ErrorMessage
            message={error.toString()}
            onRemove={() => dispatch(clearConfirmCodeError())}
          />
        ) : null}

        <View style={styles.inputWrapper}>
          <BaseTextInput
            ref="confirmationCodeInput"
            placeholder="SMS Code"
            value={this.props.confirmationCode}
            onChangeText={confirmationCode => {
              dispatch(updateData({ confirmationCode }));
            }}
            keyboardType="phone-pad"
            placeholderTextColor={theme.secondaryTextColor}
          />
        </View>
      </SignupScreen>
    );
  }

  renderNextButton = () => {
    return (
      <LoaderButton
        loading={this.props.loading}
        onPress={this.onSubmit}
        message="Confirm"
      />
    );
  };

  onSubmit = () => {
    Keyboard.dismiss();
    this.props.dispatch(submitConfirmationCode());
  };
}

const getStyles = theme => ({
  inputWrapper: {
    borderColor: theme.primaryBorderColor,
    borderWidth: StyleSheet.hairlineWidth,
    paddingLeft: 12
  }
});

module.exports = withStyles(getStyles)(
  connect(confirmationCodeScreenSelector)(ConfirmCodeScreen)
);
