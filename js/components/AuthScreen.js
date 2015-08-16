import React from 'react-native';
import { connect } from 'react-redux/native';
import merge from 'merge';
import AuthService from '../AuthService';
import Style from '../style';
import LoaderButton from './LoaderButton'
import ConfirmCodeScreen from './ConfirmCodeScreen';
import ErrorMessage from './ErrorMessage';
import Pressable from './Pressable';
import Header from './Header';
import CountryPickerScreen from './CountryPickerScreen';
import { selectRegistrationState } from '../selectors/RegistrationSelectors';
import * as RegistrationActions from '../actions/RegistrationActions';
import { navigateTo } from '../actions/NavigationActions';

let {
  Text,
  TextInput,
  View,
  ScrollView
} = React;

let {
  updateData,
  registerPhoneNumber,
  clearRegistrationError
} = RegistrationActions;

let AuthScreen = React.createClass({

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
                dispatch(clearRegistrationError())
              } /> : null }

          <Pressable onPress={() =>
            dispatch(navigateTo('countryPicker'))
          }>
            <Text style={style.countryInput} >{this.props.country}</Text>
          </Pressable>

          <View style={style.inputContainerStyle}>
            <View style={style.countryCodeWrapper}>
              <TextInput
                ref="countryCodeInput"
                style={style.countryCodeInput}
                value={this.props.countryCode}
                keyboardType="phone-pad"
                onChangeText={(countryCode) =>
                  dispatch(updateData({countryCode}))
                } />
              <Text style={style.countryCodePlus}>+</Text>
            </View>

            <TextInput
              ref="numberInput"
              style={style.numberInput}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={this.props.phoneNumber}
              onChangeText={(phoneNumber) =>
                dispatch(updateData({phoneNumber}))
              } />
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

    this.props.navigator.push({
      component: CountryPickerScreen,
      title: ''
    });
  },

  onSubmitNumber: function () {
    this.setState({
      loading: true
    });

    this.props.dispatch(registerPhoneNumber());
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

export default connect(selectRegistrationState)(AuthScreen);
