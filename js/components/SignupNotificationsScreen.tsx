import React, {Component} from 'react';
import LoaderButton from './LoaderButton';
import {navigateTo} from '../store/navigation/actions';
import {triggerPermissionsDialog} from '../store/notifications/actions';
import SignupScreen from './SignupScreen';
import withStyles, {InjectedStyles, makeStyleCreator} from '../lib/withStyles';
import ProfileEditor, {ProfileData} from './ProfileEditor';
import {updateUserInfo} from '../store/user/actions';
import {AppDispatch} from '../store/createStore';
import {Theme} from '../style/themes';
import {connect} from 'react-redux';

interface SignupNotificationScreenProps {
  dispatch: AppDispatch;
  styles: InjectedStyles<typeof getStyles>;
  theme: Theme;
  loading: boolean;
}

interface SignupNotificationScreenState {
  showNameError: boolean;
  scrollLocked: boolean;
  profile: ProfileData;
}

class SignupNotificationScreen extends Component<
  SignupNotificationScreenProps,
  SignupNotificationScreenState
> {
  state = {
    showNameError: false,
    scrollLocked: false,
    profile: {
      name: '',
      avatar: '#CCC',
    },
  };

  render() {
    return (
      <SignupScreen
        title={'Profile Setup'}
        renderNextButton={this.renderNextButton}
        scrollEnabled={!this.state.scrollLocked}
      >
        <ProfileEditor
          value={this.state.profile}
          onChange={this.handleProfileChange}
          onColorPickerInteractionStart={this.handleColorPickerInteractionStart}
          onColorPickerInteractionEnd={this.handleColorPickerInteractionEnd}
        />
      </SignupScreen>
    );
  }

  renderNextButton = () => {
    const {styles} = this.props;
    return (
      <LoaderButton
        loading={this.props.loading}
        onPress={this.handlePressNext}
        message="Save"
      />
    );
  };

  handleColorPickerInteractionStart = () => {
    this.setState({scrollLocked: true});
  };

  handleColorPickerInteractionEnd = () => {
    this.setState({scrollLocked: false});
  };

  handleProfileChange = (newValue: ProfileData) => {
    this.setState({profile: newValue});
  };

  handlePressNext = () => {
    const {profile} = this.state;
    if (profile.name === '') {
      this.setState({
        showNameError: true,
      });
    } else {
      this.props.dispatch(updateUserInfo(this.state.profile));
      this.props.dispatch(triggerPermissionsDialog());
      this.props.dispatch(navigateTo('inbox'));
    }
  };
}

const getStyles = makeStyleCreator((theme: Theme) => ({
  submit: {},
}));

const selector = () => ({});

export default connect(selector)(
  withStyles(getStyles)(SignupNotificationScreen),
);
