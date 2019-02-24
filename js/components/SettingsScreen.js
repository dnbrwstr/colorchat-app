import React from "react";
import { connect } from "react-redux";
import { View, ScrollView, Alert, Dimensions, StyleSheet } from "react-native";
import Style from "../style";
import BaseText from "./BaseText";
import Header from "./Header";
import PressableView from "./PressableView";
import { navigateTo, navigateBack } from "../actions/NavigationActions";
import {
  loadUserInfo,
  updateUserInfo,
  logout,
  deleteAccount,
  changeTheme
} from "../actions/AppActions";
import withStyles from "../lib/withStyles";
import ProfileEditor from "./ProfileEditor";

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

  maybeUpdateUser = () => {
    console.log("update user?");
    if (
      this.props.user.name !== this.state.name ||
      this.props.user.avatar !== this.state.avatar
    ) {
      console.log("update user!", this.state);
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
          borderColor={theme.secondaryBorderColor}
        />
        <ScrollView scrollEnabled={!this.state.scrollLocked}>
          <View style={styles.content}>
            <View style={styles.formContainer}>
              <ProfileEditor
                style={styles.profileEditor}
                value={this.state}
                onChange={this.handleProfileChange}
                onColorPickerInteractionStart={
                  this.handleColorPickerInteractionStart
                }
                onColorPickerInteractionEnd={
                  this.handleColorPickerInteractionEnd
                }
              />
              {this.renderThemeInput()}
            </View>

            {this.renderBottomButtons()}
          </View>
        </ScrollView>
      </View>
    );
  }

  renderThemeInput() {
    const { styles } = this.props;
    const themeKeys = Object.keys(Style.themes);
    const themes = themeKeys.map(k => Style.themes[k]);
    const currentIndex = themes.findIndex(
      theme => theme.label === this.props.theme.label
    );

    return (
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <BaseText style={[styles.inputLabel, styles.themeInputLabel]}>
            Theme
          </BaseText>

          <View>
            {themeKeys.map((k, i) =>
              this.renderThemeOption(
                i === currentIndex,
                i === themes.length - 1,
                themes[i]
              )
            )}
          </View>
        </View>
      </View>
    );
  }

  renderThemeOption = (isActive, isLast, theme) => {
    const { styles } = this.props;
    const optionStyles = [styles.themeOption, isLast && styles.lastThemeOption];
    const buttonInnerStyles = [
      styles.themeButtonInner,
      isActive && styles.themeButtonInnerActive
    ];
    return (
      <PressableView
        key={theme.label}
        style={optionStyles}
        activeStyle={styles.themeOptionActive}
        onPress={() => this.handleThemeChanged(theme)}
      >
        <View style={styles.themeButton}>
          <View style={buttonInnerStyles} />
        </View>
        <View style={styles.themeOptionTextContainer}>
          <BaseText style={styles.themeOptionText}>{theme.label}</BaseText>
        </View>
      </PressableView>
    );
  };

  renderBottomButtons() {
    const { styles } = this.props;

    const buttons = [
      { label: "About Color Chat", action: this.handleAboutPress },
      { label: "Logout", action: this.handleLogout },
      { label: "Delete account", action: this.handleDeleteAccount }
    ];

    return (
      <View style={[styles.section, styles.accountButtonContainer]}>
        {buttons.map(b => {
          return (
            <PressableView
              key={b.label}
              style={styles.accountButton}
              activeStyle={styles.accountButtonActive}
              onPress={b.action}
            >
              <BaseText>{b.label}</BaseText>
            </PressableView>
          );
        })}
      </View>
    );
  }

  handleBack = () => {
    this.maybeUpdateUser();
    this.props.dispatch(navigateBack());
  };

  handleAboutPress = () => {
    this.props.dispatch(navigateTo("about"));
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

  handleThemeChanged = newTheme => {
    this.props.dispatch(changeTheme(newTheme));
  };

  handleProfileChange = newProfile => {
    this.setState(newProfile);
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
  formContainer: {
    padding: Style.values.outerPadding
  },
  profileEditor: {
    marginBottom: 36
  },
  themeInputLabel: {
    marginBottom: 6
  },
  themeOption: {
    flexDirection: "row",
    paddingVertical: 4
  },
  themeOptionActive: {
    backgroundColor: theme.highlightColor
  },
  lastThemeOption: {},
  themeButton: {
    width: 30,
    height: 30,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.primaryBorderColor,
    marginRight: 12
  },
  themeButtonInner: {
    position: "absolute",
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    borderRadius: 12,
    overflow: "hidden"
  },
  themeButtonInnerActive: {
    backgroundColor: theme.primaryBorderColor
  },
  themeOptionTextContainer: {
    justifyContent: "center"
  },
  themeOptionText: {
    lineHeight: 18
  },
  accountButton: {
    borderTopWidth: Style.values.borderWidth,
    borderTopColor: theme.secondaryBorderColor,
    height: Style.values.rowHeight,
    padding: Style.values.outerPadding,
    justifyContent: "center"
  },
  accountButtonActive: {
    backgroundColor: theme.highlightColor
  },
  accountButtonContainer: {
    marginTop: 30,
    borderBottomWidth: Style.values.borderWidth,
    borderBottomColor: theme.secondaryBorderColor
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
