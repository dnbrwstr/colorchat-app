import React from "react";
import { Text, View, ScrollView, Animated } from "react-native";
import BaseTextInput from "./BaseTextInput";
import { connect } from "react-redux";
import Color from "color";
import merge from "merge";
import Style from "../style";
import LoaderButton from "./LoaderButton";
import ErrorMessage from "./ErrorMessage";
import PressableView from "./PressableView";
import BaseText from "./BaseText";
import { signupScreenSelector } from "../lib/Selectors";
import * as SignupActions from "../actions/SignupActions";
import { navigateTo } from "../actions/NavigationActions";
import SignupScreen from "./SignupScreen";

let { updateData, registerPhoneNumber, clearSignupError } = SignupActions;

class SignupStartScreen extends React.Component {
  handleNumberInfoLinkPress = () => {
    this.props.dispatch(navigateTo("numberInfo"));
  };

  render() {
    let { dispatch, error } = this.props;

    return (
      <SignupScreen title="Setup" renderNextButton={this.renderNextButton}>
        <BaseText style={style.welcomeMessage}>
          Color Chat will send you an SMS message to verify your phone number
        </BaseText>

        {error ? (
          <ErrorMessage
            message={error.toString()}
            onRemove={() => dispatch(clearSignupError())}
          />
        ) : null}

        <PressableView
          style={style.countryInput}
          activeStyle={style.countryInputActive}
          onPress={this.showCountryPicker}
        >
          <BaseText style={style.countryInputText}>
            {this.props.country}
          </BaseText>
          <BaseText style={style.countryInputArrow}>&darr;</BaseText>
        </PressableView>

        <View style={style.inputContainer}>
          <View style={style.countryCodeWrapper}>
            <BaseTextInput
              ref="countryCodeInput"
              style={style.countryCodeInput}
              value={this.props.countryCode}
              onChangeText={countryCode => {
                this.updateData({ countryCode });
              }}
              keyboardType="phone-pad"
            />
            <BaseText style={style.countryCodePlus}>+</BaseText>
          </View>

          <View style={style.numberInputWrapper}>
            <BaseTextInput
              ref="baseNumberInput"
              style={style.numberInput}
              value={this.props.baseNumber}
              onChangeText={baseNumber => {
                this.updateData({ baseNumber });
              }}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <PressableView
          style={style.numberInfoLink}
          onPress={this.handleNumberInfoLinkPress}
        >
          <BaseText style={style.numberInfoText}>
            How Color Chat uses your number
          </BaseText>
        </PressableView>
      </SignupScreen>
    );
  }

  renderNextButton = () => {
    return (
      <LoaderButton
        style={style.submit}
        loading={this.props.loading}
        onPress={this.onSubmitNumber}
        message="Send message"
      />
    );
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
    this.refs.countryCodeInput.blur();
    this.refs.baseNumberInput.blur();
  };

  updateData = newData => {
    this.props.dispatch(updateData(newData));
  };
}

let {
  inputBase,
  grayBottomBorder,
  outerWrapperBase,
  textBase,
  contentWrapperBase
} = Style.mixins;

let style = Style.create({
  welcomeMessage: {
    marginBottom: 16,
    marginTop: 0
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginBottom: 16
  },
  countryInput: {
    ...grayBottomBorder,
    height: inputBase.height + 1,
    paddingTop: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5
  },
  countryInputActive: {
    backgroundColor: Style.values.fairlyLightGray
  },
  countryInputText: {
    flex: 1
  },
  countryInputArrow: {
    flex: 0
  },
  numberInputWrapper: {
    ...grayBottomBorder,
    alignSelf: "stretch",
    flex: 1
  },
  countryCodeWrapper: {
    ...grayBottomBorder,
    width: 60,
    flex: 0,
    margin: 0,
    padding: 0,
    marginRight: 12
  },
  countryCodePlus: {
    position: "absolute",
    top: 9,
    bottom: 0,
    left: 0,
    backgroundColor: "transparent"
  },
  countryCodeInput: {
    paddingLeft: 12
  },
  numberInfoLink: {
    marginTop: 10
  },
  numberInfoText: {
    fontSize: Style.values.smallFontSize,
    textAlign: "center",
    textDecorationLine: "underline"
  }
});

export default connect(signupScreenSelector)(SignupStartScreen);
