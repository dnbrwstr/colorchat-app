import React from "react";
import { connect } from "react-redux";
import { View, ScrollView, Alert, Dimensions } from "react-native";
import Style from "../style";
import BaseTextInput from "./BaseTextInput";
import BaseText from "./BaseText";
import Header from "./Header";
import PressableView from "./PressableView";
import AvatarEditor from "./AvatarEditor";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { navigateTo, navigateBack } from "../actions/NavigationActions";
import {
  loadUserInfo,
  updateUserInfo,
  logout,
  deleteAccount,
  changeTheme
} from "../actions/AppActions";
import withStyles from "../lib/withStyles";

class SettingsScreen extends React.Component {
  state = {
    name: this.props.user.name || "",
    avatar: this.props.user.avatar || "#CCC",
    scrollLocked: false
  };

  componentDidMount(prevProps) {
    this.props.dispatch(loadUserInfo());
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.user.name !== this.props.user.name) {
      this.setState({ name: nextProps.user.name });
    }

    if (nextProps.user.avatar !== this.props.user.avatar) {
      this.setState({ avatar: nextProps.user.avatar });
    }
  }

  handleBack = () => {
    this.maybeUpdateUser();
    this.props.dispatch(navigateBack());
  };

  handleInputRowPress = inputRef => {
    this.refs[inputRef].focus();
  };

  handleLogout = () => {
    let message = "Log out of this device?";

    Alert.alert(
      message,
      null,
      [
        { text: "Cancel", onPress: () => {} },
        { text: "Logout", onPress: this.handleLogoutConfirmation }
      ],
      { cancelable: false }
    );
  };

  handleLogoutConfirmation = () => {
    this.props.dispatch(logout());
  };

  handleAboutPress = () => {
    this.props.dispatch(navigateTo("about"));
  };

  handleInputBlur = () => {
    this.maybeUpdateUser();
  };

  handleDeleteAccount = (e, retry) => {
    let message = `Enter your phone number (including area code and country code) to delete your account. This is not reversible.`;

    if (retry) message = "Invalid number. " + message;

    AlertIOS.prompt(message, [
      { text: "Cancel", onPress: () => {} },
      { text: "Delete", onPress: this.handleDeleteAccountConfirmation }
    ]);
  };

  handleDeleteAccountConfirmation = value => {
    let isValidConfirmation =
      "+" + value.replace(/[^0-9]/g, "") === this.props.user.phoneNumber;

    if (isValidConfirmation) {
      this.props.dispatch(deleteAccount());
    } else {
      this.handleDeleteAccount(null, true);
    }
  };

  maybeUpdateUser = () => {
    if (
      this.props.user.name !== this.state.name ||
      this.props.user.avatar !== this.state.avatar
    ) {
      this.props.dispatch(
        updateUserInfo({ name: this.state.name, avatar: this.state.avatar })
      );
    }
  };

  render() {
    const { theme, styles } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title="Settings"
          showBack={true}
          onBack={this.handleBack}
          borderColor={theme.borderColor}
        />
        <ScrollView scrollEnabled={!this.state.scrollLocked}>
          <View style={styles.content}>
            <View style={[styles.section, styles.profileInputSection]}>
              <AvatarEditor
                initialValue={this.state.avatar}
                onInteractionStart={this.handleColorPickerInteractionStart}
                onInteractionEnd={this.handleColorPickerInteractionEnd}
                onChange={this.handleAvatarChange}
                style={styles.profileInput}
              />
              <BaseText style={styles.profileInputLabel}>
                Touch and drag to change your avatar
              </BaseText>
            </View>
            <View style={[styles.section, styles.nameSection]}>
              <View style={styles.sectionContent}>
                <PressableView
                  style={styles.inputRow}
                  onPress={this.handleInputRowPress.bind(this, "nameInput")}
                >
                  <BaseText style={[styles.inputLabel, styles.nameInputLabel]}>
                    Username
                  </BaseText>

                  <View style={styles.inputWrapper}>
                    <BaseTextInput
                      ref="nameInput"
                      placeholder="Your name"
                      style={styles.input}
                      onBlur={this.handleInputBlur.bind(this, "name")}
                      onChangeText={this.handleNameInputChange}
                      value={this.state.name}
                    />
                  </View>
                </PressableView>
              </View>
            </View>

            {this.renderThemeInput()}

            <View style={[styles.section, styles.accountButtonContainer]}>
              <PressableView
                style={styles.accountButton}
                activeStyle={styles.accountButtonActive}
                onPress={this.handleAboutPress}
              >
                <BaseText>About Color Chat</BaseText>
              </PressableView>
              <PressableView
                style={styles.accountButton}
                activeStyle={styles.accountButtonActive}
                onPress={this.handleLogout}
              >
                <BaseText>Logout</BaseText>
              </PressableView>
              <PressableView
                onPress={this.handleDeleteAccount}
                style={styles.accountButton}
                activeStyle={styles.accountButtonActive}
              >
                <BaseText>Delete account</BaseText>
              </PressableView>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  renderThemeInput() {
    const { styles } = this.props;
    const themeKeys = Object.keys(Style.themes);
    const themes = themeKeys.map(k => Style.themes[k]);
    const currentIndex = themes.indexOf(this.props.theme);

    return (
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <BaseText style={[styles.inputLabel, styles.themeInputLabel]}>
            Theme
          </BaseText>
          <SegmentedControlTab
            values={themeKeys}
            selectedIndex={currentIndex}
            onTabPress={i => this.handleThemeChanged(themes[i])}
          />
        </View>
      </View>
    );
  }

  handleThemeChanged = newTheme => {
    this.props.dispatch(changeTheme(newTheme));
  };

  handleAvatarChange = newColor => {
    this.setState({ avatar: newColor });
  };

  handleNameInputChange = newName => {
    this.setState({ name: newName });
  };

  handleColorPickerInteractionStart = () => {
    this.setState({ scrollLocked: true });
  };

  handleColorPickerInteractionEnd = () => {
    this.setState({ scrollLocked: false });
  };
}

const getStyles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  content: {
    ...Style.mixins.contentWrapperBase,
    padding: 0,
    flex: 1,
    padding: 0
  },
  inputRow: {},
  inputRowLabel: {
    flex: 0,
    justifyContent: "center",
    width: 60
  },
  inputWrapper: {
    flex: 1,
    borderBottomWidth: Style.values.borderWidth,
    borderBottomColor: theme.borderColor,
    margin: 0
  },
  button: {
    marginTop: 0,
    marginBottom: 0
  },
  section: {
    flex: 1
  },
  sectionContent: {
    padding: Style.values.horizontalPadding
  },
  accountButton: {
    borderTopWidth: Style.values.borderWidth,
    borderTopColor: theme.borderColor,
    height: Style.values.rowHeight,
    padding: Style.values.horizontalPadding,
    justifyContent: "center"
  },
  accountButtonActive: {
    backgroundColor: theme.highlightColor
  },
  accountButtonContainer: {
    marginTop: 50,
    borderBottomWidth: Style.values.borderWidth,
    borderBottomColor: theme.borderColor
  },
  profileInputSection: {
    alignItems: "center",
    marginVertical: 20
  },
  profileInput: {
    width: 250,
    height: 250,
    borderRadius: 1000,
    marginBottom: 20
  },
  profileEditButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "white",
    elevation: 2
  },
  profileInputLabel: {
    textAlign: "center",
    width: 200
  },
  nameSection: {
    flex: 0
  },
  input: {
    paddingTop: 8
  },
  inputLabel: {
    fontSize: 12,
    lineHeight: 12,
    color: theme.secondaryTextColor
  },
  themeInputLabel: {
    marginBottom: 10
  },
  aboutSection: {
    flex: 0,
    justifyContent: "flex-end"
  },
  aboutButton: {
    padding: Style.values.outerPadding,
    paddingBottom: 20,
    paddingTop: 40
  },
  aboutButtonText: {
    textAlign: "center"
  }
});

let settingsScreenSelector = state => {
  return {
    user: state.user
  };
};

export default withStyles(getStyles)(
  connect(settingsScreenSelector)(SettingsScreen)
);
