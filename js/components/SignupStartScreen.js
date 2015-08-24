import React from 'react-native';
import { connect } from 'react-redux/native';
import merge from 'merge';
import AuthService from '../AuthService';
import Style from '../style';
import LoaderButton from './LoaderButton'
import ConfirmCodeScreen from './ConfirmCodeScreen';
import ErrorMessage from './ErrorMessage';
import PressableView from './PressableView';
import Header from './Header';
import { signupScreenSelector } from '../lib/Selectors';
import * as SignupActions from '../actions/SignupActions';
import { navigateTo } from '../actions/NavigationActions';
import DecoupledInput from './DecoupledInput';

let {
  Text,
  TextInput,
  View,
  ScrollView
} = React;

let {
  updateData,
  registerPhoneNumber,
  clearSignupError
} = SignupActions;

let SignupStartScreen = React.createClass({
  render: function() {
    let { dispatch, error } = this.props;

    return (
      <View style={style.container} ref="container">
        <Header title="Setup"/>

        <View style={style.screenContent}>
          <Text style={style.welcomeMessage}>
            Color Chat will send you
            an SMS message to verify
            your phone number.
          </Text>

          { error ?
            <ErrorMessage
              message={error.toString()}
              onRemove={() =>
                dispatch(clearSignupError())
              } /> : null }

          <PressableView onPress={this.showCountryPicker}>
            <Text style={style.countryInput} >{this.props.country}</Text>
          </PressableView>

          <View style={style.inputContainerStyle}>
            <View style={style.countryCodeWrapper}>
              <DecoupledInput
                ref="countryCodeInput"
                style={style.countryCodeInput}
                initialValue={this.props.countryCode}
                keyboardType="phone-pad" />
              <Text style={style.countryCodePlus}>+</Text>
            </View>

            <DecoupledInput
              ref="numberInput"
              style={style.numberInput}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              initialValue={this.props.phoneNumber} />
          </View>
        </View>

        <LoaderButton
          style={style.submit}
          loading={this.props.loading}
          onPress={this.onSubmitNumber}
          messages={{
            base: 'Send message',
            loading: 'Loading...'
          }} />
      </View>
    );
  },

  showCountryPicker: function () {
    this.refs.countryCodeInput.blur();
    this.refs.numberInput.blur();
    this.updateData();
    this.props.dispatch(navigateTo('countryPicker'));
  },

  onSubmitNumber: function () {
    this.updateData();
    this.props.dispatch(registerPhoneNumber());
  },

  updateData: function () {
    let phoneNumber = this.refs.numberInput.getValue();
    let countryCode = this.refs.countryCodeInput.getValue();

    this.props.dispatch(updateData({
      phoneNumber,
      countryCode
    }));
  }
});

let style = Style.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#EFEFEF'
  },
  screenContent: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  inputContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    margin: 5
  },
  countryInput: {
    mixins: [Style.mixins.inputBase],
    margin: 5,
    marginBottom: 0
  },
  countryInputActive: {
    color: 'white',
    backgroundColor: 'black'
  },
  numberInput: {
    mixins: [Style.mixins.inputBase],
    alignSelf: 'stretch',
    flex: 1
  },
  welcomeMessage: {
    mixins: [Style.mixins.textBase],
    margin: 5,
    marginTop: 10,
    width: 250
  },
  countryCodePlus: {
    mixins: [Style.mixins.textBase],
    position: 'absolute',
    top: 11,
    bottom: 0,
    left: 15,
    backgroundColor: 'transparent'
  },
  countryCodeWrapper: {
    width: 80,
    flex: 0,
    margin: 0,
    padding: 0
  },
  countryCodeInput: {
    mixins: [Style.mixins.inputBase],
    paddingLeft: 24,
    marginRight: 5,
    color: Style.values.midGray
  }
});

export default connect(signupScreenSelector)(SignupStartScreen);
