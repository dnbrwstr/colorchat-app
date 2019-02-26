import React from "react";
import { View, Keyboard, StyleSheet } from "react-native";
import BaseTextInput from "./BaseTextInput";
import { connect } from "react-redux";
import Style from "../style";
import LoaderButton from "./LoaderButton";
import ErrorMessage from "./ErrorMessage";
import PressableView from "./PressableView";
import BaseText from "./BaseText";
import { signupScreenSelector } from "../lib/Selectors";
import * as SignupActions from "../actions/SignupActions";
import { navigateTo } from "../actions/NavigationActions";
import SignupScreen from "./SignupScreen";
import withStyles from "../lib/withStyles";

let { updateData, registerPhoneNumber, clearSignupError } = SignupActions;

class SignupStartScreen extends React.Component {
  render() {
    let { dispatch, error, styles, theme } = this.props;

    return (
      <SignupScreen title="Setup" renderNextButton={this.renderNextButton}>
        <BaseText style={styles.welcomeMessage}>
          Color Chat will send you an SMS message to verify your phone number.
        </BaseText>

        {error && (
          <ErrorMessage
            message={error.toString()}
            onRemove={() => dispatch(clearSignupError())}
          />
        )}

        <View style={styles.numberInputContainer}>
          <PressableView
            style={styles.countryCodeWrapper}
            activeStyle={styles.countryCodeWrapperActive}
            onPress={this.showCountryPicker}
          >
            <BaseText style={styles.countryCode}>
              +{this.props.countryCode}
            </BaseText>
          </PressableView>

          <View style={styles.baseNumberInputWrapper}>
            <BaseTextInput
              style={styles.baseNumberInput}
              value={this.props.baseNumber}
              onChangeText={baseNumber => {
                this.updateData({ baseNumber });
              }}
              placeholder="Phone Number"
              placeholderTextColor={theme.secondaryTextColor}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <PressableView
          style={styles.usageInfoLink}
          onPress={this.handleusageInfoLinkPress}
        >
          <BaseText style={styles.usageInfoText}>
            How Color Chat uses your number
          </BaseText>
        </PressableView>
      </SignupScreen>
    );
  }

  renderNextButton = () => {
    return (
      <LoaderButton
        style={this.props.styles.submit}
        loading={this.props.loading}
        onPress={this.onSubmitNumber}
        message="Send message"
      />
    );
  };

  handleusageInfoLinkPress = () => {
    this.props.dispatch(navigateTo("numberInfo"));
  };

  showCountryPicker = () => {
    this.hideKeyboard();
    this.props.dispatch(navigateTo("countryPicker"));
  };

  onSubmitNumber = () => {
    this.hideKeyboard();
    this.props.dispatch(registerPhoneNumber());
  };

  hideKeyboard = () => {
    Keyboard.dismiss();
  };

  updateData = newData => {
    this.props.dispatch(updateData(newData));
  };
}

let { inputBase } = Style.mixins;

let getStyles = theme => ({
  welcomeMessage: {
    marginTop: 0,
    marginBottom: 20
  },
  numberInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginBottom: 8,
    height: Style.values.buttonHeight
  },
  countryCodeWrapper: {
    borderColor: theme.primaryBorderColor,
    borderWidth: StyleSheet.hairlineWidth,
    width: Style.values.buttonHeight,
    alignItems: "center",
    justifyContent: "center"
  },
  countryCodeWrapperActive: {
    backgroundColor: theme.highlightColor
  },
  countryCode: {
    textAlign: "center",
    paddingVertical: 10
  },
  baseNumberInputWrapper: {
    borderColor: theme.primaryBorderColor,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 0,
    alignSelf: "stretch",
    flex: 1
  },
  baseNumberInput: {},
  usageInfoLink: {
    marginTop: 0
  },
  usageInfoText: {
    fontSize: Style.values.smallFontSize,
    textAlign: "center",
    color: theme.secondaryTextColor,
    textDecorationLine: "underline"
  }
});

export default withStyles(getStyles)(
  connect(signupScreenSelector)(SignupStartScreen)
);
