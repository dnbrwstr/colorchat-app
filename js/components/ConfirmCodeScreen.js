import React from 'react';
import {
  View,
  Text,
  TextInput,
  Animated
} from 'react-native';
import { connect } from 'react-redux';
import Style from '../style';
import LoaderButton from './LoaderButton';
import ErrorMessage from './ErrorMessage';
import SignupScreen from './SignupScreen';
import { navigateTo } from '../actions/NavigationActions';
import { submitConfirmationCode, updateData, clearConfirmCodeError } from '../actions/SignupActions';
import { confirmationCodeScreenSelector } from '../lib/Selectors'

let ConfirmCodeScreen = React.createClass({
  render: function () {
    let { dispatch, error, loading } = this.props;

    return (
      <SignupScreen
        title="Confirm code"
        onNavigateBack={() => dispatch(navigateTo('signup'))}
        renderNextButton={this.renderNextButton}
      >
        { error ?
          <ErrorMessage
            message={error.toString()}
            onRemove={() => dispatch(clearConfirmCodeError())}
          /> : null }

        <View style={style.inputWrapper}>
          <TextInput
            ref="confirmationCodeInput"
            placeholder="SMS Code"
            style={style.input}
            value={this.props.confirmationCode}
            onChangeText={ confirmationCode => {dispatch(updateData({ confirmationCode }))}}
            keyboardType="phone-pad"
          />
        </View>
      </SignupScreen>
    )
  },

  renderNextButton: function () {
    return (
      <LoaderButton
        loading={this.props.loading}
        onPress={this.onSubmit}
        message="Confirm"
      />
    );
  },

  onSubmit: function () {
    this.refs.confirmationCodeInput.blur();
    this.props.dispatch(submitConfirmationCode());
  }
});

let {
  inputBase,
  grayBottomBorder,
  outerWrapperBase,
  contentWrapperBase
} = Style.mixins;

var style = Style.create({
  inputWrapper: {
    ...grayBottomBorder,
  },
  input: {
    ...inputBase,
  }
})

module.exports = connect(confirmationCodeScreenSelector)(ConfirmCodeScreen);
