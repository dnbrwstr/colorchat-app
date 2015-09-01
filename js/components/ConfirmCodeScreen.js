import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import LoaderButton from './LoaderButton';
import ErrorMessage from './ErrorMessage';
import { navigateBack } from '../actions/NavigationActions';
import { submitConfirmationCode, updateData, clearConfirmCodeError } from '../actions/SignupActions';
import { confirmationCodeScreenSelector } from '../lib/Selectors'
import Header from './Header';
import DecoupledInput from './DecoupledInput';

let {
  View,
  Text,
  TextInput
} = React;

let ConfirmCodeScreen = React.createClass({
  getInitialState: () => ({
    loading: false
  }),

  render: function () {
    let { dispatch, error, loading } = this.props;

    return (
      <View style={style.container}>
        <Header title="Confirm code" showBack={true} onBack={() =>
          dispatch(navigateBack())
        } />

        <View style={style.screenContent}>
          { error ?
            <ErrorMessage
              message={error.toString()}
              onRemove={() =>
                dispatch(clearConfirmCodeError({
                  error: ''
                }))
            } /> : null }

          <View style={style.inputWrapper}>
            <DecoupledInput
              ref="confirmationCodeInput"
              placeholder="SMS Code"
              style={style.input}
              initialValue={this.props.confirmationCode} />
          </View>
        </View>

        <LoaderButton
          loading={loading}
          onPress={this.onSubmit}
          message="Confirm code"
        />
      </View>
    )
  },

  onSubmit: function () {
    this.refs.confirmationCodeInput.blur();
    let confirmationCode = this.refs.confirmationCodeInput.getValue();
    this.props.dispatch(updateData({ confirmationCode }));
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
  container: {
    ...outerWrapperBase
  },
  screenContent: {
    ...contentWrapperBase,
    paddingTop: 12,
  },
  inputWrapper: {
    ...grayBottomBorder,
  },
  input: {
    ...inputBase,
  }
})

module.exports = connect(confirmationCodeScreenSelector)(ConfirmCodeScreen);
