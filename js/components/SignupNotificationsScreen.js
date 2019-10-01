import React, {Component} from 'react';
import LoaderButton from './LoaderButton';
import {navigateTo} from '../store/navigation/actions';
import {triggerPermissionsDialog} from '../store/notifications/actions';
import SignupScreen from './SignupScreen';
import {connectWithStyles} from '../lib/withStyles';
import ProfileEditor from './ProfileEditor';
import {updateUserInfo} from '../store/user/actions';

class SignupNotificationScreen extends Component {
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
          showNameError={this.state.showNameError}
          onDismissNameError={this.handleDismissNameError}
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
        style={styles.submit}
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

  handleProfileChange = newValue => {
    this.setState({profile: newValue});
  };

  handleDismissNameError = () => {
    this.setState({showNameError: false});
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

var getStyles = theme => ({});

export default connectWithStyles(getStyles, () => ({}))(
  SignupNotificationScreen,
);
