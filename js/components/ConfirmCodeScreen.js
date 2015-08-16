import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import LoaderButton from './LoaderButton';
import AuthService from '../AuthService';
import ErrorMessage from './ErrorMessage';
import { navigateBack } from '../actions/NavigationActions';
import { submitConfirmationCode, updateData } from '../actions/RegistrationActions';
import Header from './Header';

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

          <TextInput
            placeholder="SMS Code"
            style={style.input}
            value={this.props.confirmationCode}
            onChangeText={(confirmationCode) =>
              dispatch(updateData({ confirmationCode }))
            } />

          <LoaderButton
            loading={this.props.loading}
            onPress={() =>
              dispatch(submitConfirmationCode())
            }
            messages={{
              base: 'Confirm code',
              loading: 'Loading...'
            }} />
        </View>
      </View>
    )
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

module.exports = connect(state => state.registration)(ConfirmCodeScreen);
