import React from 'react';
import {
  View,
  Text,
  Animated
} from 'react-native';
import { connect } from 'react-redux';
import Style from '../style';
import BaseTextInput from './BaseTextInput';
import LoaderButton from './LoaderButton';
import { navigateTo } from '../actions/NavigationActions';
import { triggerPermissionsDialog } from '../actions/NotificationActions';
import { saveName } from '../actions/SignupActions';
import SignupScreen from './SignupScreen';

class SignupNotificationScreen extends React.Component {
  state = {
    name: ''
  };

  render() {
    let { dispatch, error, loading } = this.props;

    return (
      <SignupScreen
        title={'Set display name'}
        renderNextButton={this.renderNextButton}
      >
        <View style={style.inputWrapper}>
          <BaseTextInput
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
  }

  renderNextButton = () => {
    return (
      <LoaderButton
        style={style.submit}
        loading={this.props.loading}
        onPress={this.onPressNext}
        message="Save"
      />
    );
  };

  onPressNext = () => {
    this.props.dispatch(saveName(this.state.name));
    this.props.dispatch(triggerPermissionsDialog());
    this.props.dispatch(navigateTo('inbox'));
  };
}

let {
  textBase,
  inputBase,
  grayBottomBorder,
} = Style.mixins;

var style = Style.create({
  inputWrapper: {
    ...grayBottomBorder,
  },
  text: {
    ...textBase,
    marginTop: 12
  }
});

export default connect(()=>({}))(SignupNotificationScreen);
