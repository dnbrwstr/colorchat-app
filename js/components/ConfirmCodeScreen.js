import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import LoaderButton from './LoaderButton';
import AuthService from '../AuthService';
import ErrorMessage from './ErrorMessage';
import { navigateBack } from '../actions/NavigationActions';
import { submitConfirmationCode, updateData } from '../actions/SignupActions';
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
    let { dispatch, error } = this.props;

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
                dispatch(updateData({
                  error: ''
                }))
              } /> : null }

          <DecoupledInput
            ref="confirmationCodeInput"
            placeholder="SMS Code"
            style={style.input}
            initialValue={this.props.confirmationCode} />

          <LoaderButton
            loading={this.props.loading}
            onPress={this.onSubmit}
            messages={{
              base: 'Confirm code',
              loading: 'Loading...'
            }} />
        </View>
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

var style = Style.create({
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
  input: {
    mixins: [Style.mixins.inputBase],
    margin: 5
  }
})

module.exports = connect(state => state.signup)(ConfirmCodeScreen);
