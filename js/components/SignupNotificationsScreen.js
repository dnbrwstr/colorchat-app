import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import LoaderButton from './LoaderButton';
import { navigateTo } from '../actions/NavigationActions';
import { triggerPermissionsDialog } from '../actions/NotificationActions';
import { saveName } from '../actions/SignupActions';
import SignupScreen from './SignupScreen';

let {
  View,
  Text,
  TextInput,
  Animated
} = React;

let SignupNotificationScreen = React.createClass({

  getInitialState: function () {
    return {
      name: ''
    };
  },

  render: function () {
    let { dispatch, error, loading } = this.props;

    return (
      <SignupScreen
        title={'Notifications'}
        renderNextButton={this.renderNextButton}
      >
        <View style={style.inputWrapper}>
          <TextInput
            style={style.input}
            placeholder="Name"
            ref="nameInput"
            value={this.props.name}
            onChangeText={ name => this.setState({ name }) }
          />
        </View>

        <Text style={style.text}>
          Your friends will see this in push notifications when you message them
        </Text>
      </SignupScreen>
    )
  },

  renderNextButton: function () {
    return (
      <LoaderButton
        style={style.submit}
        loading={this.props.loading}
        onPress={this.onPressNext}
        message="Save"
      />
    );
  },

  onPressNext: function () {
    this.props.dispatch(saveName(this.state.name));
    this.props.dispatch(triggerPermissionsDialog());
    this.props.dispatch(navigateTo('main'));
  }
});

let {
  textBase,
  inputBase,
  grayBottomBorder,
} = Style.mixins;

var style = Style.create({
  inputWrapper: {
    ...grayBottomBorder,
  },
  input: {
    ...inputBase,
  },
  text: {
    ...textBase,
    marginTop: 12
  }
})

export default connect(()=>({}))(SignupNotificationScreen);
