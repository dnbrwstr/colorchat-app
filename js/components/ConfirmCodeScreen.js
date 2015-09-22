import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import LoaderButton from './LoaderButton';
import ErrorMessage from './ErrorMessage';
import { navigateBack } from '../actions/NavigationActions';
import { submitConfirmationCode, updateData, clearConfirmCodeError } from '../actions/SignupActions';
import { confirmationCodeScreenSelector } from '../lib/Selectors'
import Header from './Header';
import KeyboardMixin from './mixins/KeyboardMixin';

let {
  View,
  Text,
  TextInput,
  Animated
} = React;

let ConfirmCodeScreen = React.createClass({
  mixins: [KeyboardMixin],

  getInitialState: () => ({
    loading: false
  }),

  render: function () {
    let { dispatch, error, loading } = this.props;

    let buttonStyle = [{
      flex: 0,
      transform: [
        { translateY: this.state.animatedKeyboardHeight }
      ]
    }];

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
            <TextInput
              ref="confirmationCodeInput"
              placeholder="SMS Code"
              style={style.input}
              value={this.props.confirmationCode}
              onChangeText={ confirmationCode => {dispatch(updateData({ confirmationCode }))}}
              keyboardType="phone-pad" />
          </View>
        </View>

        <Animated.View style={buttonStyle}>
          <LoaderButton
            loading={loading}
            onPress={this.onSubmit}
            message="Confirm code"
          />
        </Animated.View>
      </View>
    )
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
