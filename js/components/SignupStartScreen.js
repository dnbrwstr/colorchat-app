import React from 'react-native';
import { connect } from 'react-redux/native';
import Color from 'color';
import merge from 'merge';
import Style from '../style';
import LoaderButton from './LoaderButton';
import ErrorMessage from './ErrorMessage';
import PressableView from './PressableView';
import Header from './Header';
import BaseText from './BaseText';
import { signupScreenSelector } from '../lib/Selectors';
import * as SignupActions from '../actions/SignupActions';
import { navigateTo } from '../actions/NavigationActions';
import DecoupledInput from './DecoupledInput';
import KeyboardMixin from './mixins/KeyboardMixin';

let {
  Text,
  TextInput,
  View,
  ScrollView,
  Animated
} = React;

let {
  updateData,
  registerPhoneNumber,
  clearSignupError
} = SignupActions;

let SignupStartScreen = React.createClass({
  mixins: [KeyboardMixin],

  render: function() {
    let { dispatch, error } = this.props;

    let buttonStyle = [
      style.container,
      {
        flex: 0,
        transform: [
          { translateY: this.state.animatedKeyboardHeight }
        ]
      }
    ];

    return (
      <View style={style.container} ref="container">
        <Header title="Setup" />

        <View style={style.screenContent}>
          <BaseText style={style.welcomeMessage}>
            Color Chat will send you
            an SMS message to verify
            your phone number
          </BaseText>

          { error ?
            <ErrorMessage
              message={error.toString()}
              onRemove={() =>
                dispatch(clearSignupError())
              } /> : null }

          <PressableView
            style={style.countryInput}
            activeStyle={style.countryInputActive}
            onPress={this.showCountryPicker}
          >
            <BaseText style={style.countryInputText}>{this.props.country}</BaseText>
            <BaseText style={style.countryInputArrow}>&darr;</BaseText>
          </PressableView>

          <View style={style.inputContainer}>
            <View style={style.countryCodeWrapper}>
              <DecoupledInput
                ref="countryCodeInput"
                style={style.countryCodeInput}
                initialValue={this.props.countryCode}
                keyboardType="phone-pad" />
              <BaseText style={style.countryCodePlus}>+</BaseText>
            </View>

            <View style={style.numberInputWrapper}>
              <DecoupledInput
                ref="baseNumberInput"
                style={style.numberInput}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                initialValue={this.props.baseNumber} />
            </View>
          </View>
        </View>

        <Animated.View style={buttonStyle}>
          <LoaderButton
            style={style.submit}
            loading={this.props.loading}
            onPress={this.onSubmitNumber}
            message="Send message" />
        </Animated.View>
      </View>
    );
  },

  showCountryPicker: function () {
    this.hideKeyboard();
    this.updateData();
    this.props.dispatch(navigateTo('countryPicker'));
  },

  onSubmitNumber: function () {
    this.hideKeyboard();
    this.updateData();
    this.props.dispatch(registerPhoneNumber());
  },

  hideKeyboard: function () {
    this.refs.countryCodeInput.blur();
    this.refs.baseNumberInput.blur();
  },

  updateData: function () {
    let baseNumber = this.refs.baseNumberInput.getValue();
    let countryCode = this.refs.countryCodeInput.getValue();

    this.props.dispatch(updateData({
      baseNumber,
      countryCode
    }));
  }
});

let { outerPadding } = Style.values;
let {
  inputBase,
  grayBottomBorder,
  outerWrapperBase,
  textBase,
  contentWrapperBase
} = Style.mixins;

let style = Style.create({
  container: {
    ...outerWrapperBase
  },
  screenContent: {
    ...contentWrapperBase,
    paddingTop: 22
  },
  welcomeMessage: {
    marginBottom: 16,
    marginTop: 0
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: 5
  },
  countryInput: {
    ...inputBase,
    ...grayBottomBorder,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5
  },
  countryInputActive: {
    color: 'white',
    backgroundColor: Color('#EFEFEF').darken(.1).hexString()
  },
  countryInputText: {
    flex: 1,
    paddingTop: 13
  },
  countryInputArrow: {
    flex: 0,
    paddingTop: 13
  },
  numberInputWrapper: {
    ...grayBottomBorder,
    alignSelf: 'stretch',
    flex: 1,
  },
  numberInput: {
    ...inputBase,
    ...textBase
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
    position: 'absolute',
    top: 15,
    bottom: 0,
    left: 0,
    backgroundColor: 'transparent'
  },
  countryCodeInput: {
    ...inputBase,
    ...textBase,
    paddingLeft: 12
  }
});

export default connect(signupScreenSelector)(SignupStartScreen);
