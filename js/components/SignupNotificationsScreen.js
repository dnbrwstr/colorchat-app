import React from "react";
import LoaderButton from "./LoaderButton";
import { navigateTo } from "../actions/NavigationActions";
import { triggerPermissionsDialog } from "../actions/NotificationActions";
import SignupScreen from "./SignupScreen";
import { connectWithStyles } from "../lib/withStyles";
import ProfileEditor from "./ProfileEditor";
import { updateUserInfo } from "../actions/AppActions";

class SignupNotificationScreen extends React.Component {
  state = {
    name: "",
    avatar: "#CCC"
  };

  render() {
    return (
      <SignupScreen title={"Profile"} renderNextButton={this.renderNextButton}>
        <ProfileEditor value={this.state} onChange={this.handleProfileChange} />
      </SignupScreen>
    );
  }

  renderNextButton = () => {
    const { styles } = this.props;
    return (
      <LoaderButton
        style={styles.submit}
        loading={this.props.loading}
        onPress={this.onPressNext}
        message="Save"
      />
    );
  };

  handleProfileChange = newValue => {
    this.setState(newValue);
  };

  onPressNext = () => {
    if (this.state.name === "") {
      this.setState({
        showNameError: true
      });
    } else {
      this.props.dispatch(
        updateUserInfo({
          name: this.state.name,
          avatar: this.state.avatar
        })
      );
      this.props.dispatch(triggerPermissionsDialog());
      this.props.dispatch(navigateTo("inbox"));
    }
  };
}

var getStyles = theme => ({});

export default connectWithStyles(getStyles, () => ({}))(
  SignupNotificationScreen
);
