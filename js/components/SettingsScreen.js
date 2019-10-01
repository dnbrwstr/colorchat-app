import React from 'react';
import {connect} from 'react-redux';
import {View, ScrollView, Alert, StyleSheet} from 'react-native';
import Style from '../style';
import BaseText from './BaseText';
import Header from './Header';
import PressableView from './PressableView';
import {navigateTo, navigateBack} from '../store/navigation/actions';
import {
  loadUserInfo,
  updateUserInfo,
  logout,
  deleteAccount,
} from '../store/user/actions';
import {changeTheme} from '../store/ui/actions';
import withStyles from '../lib/withStyles';
import ProfileEditor from './ProfileEditor';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import RowButtonGroup from './RowButtonGroup';

class SettingsScreen extends React.Component {
  state = {
    name: this.props.user.name || '',
    avatar: this.props.user.avatar || '#CCC',
    scrollLocked: false,
  };

  constructor(props) {
    super(props);
    this.buttons = [
      {label: 'About Color Chat', action: this.handleAboutPress},
      {label: 'Blocked users', action: this.handleBlockedUsersPress},
      {label: 'Logout', action: this.handleLogout},
      {label: 'Delete account', action: this.handleDeleteAccount},
    ];
  }

  componentDidMount(prevProps) {
    this.props.dispatch(loadUserInfo());
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.user.name !== this.props.user.name) {
      this.setState({name: nextProps.user.name});
    }

    if (nextProps.user.avatar !== this.props.user.avatar) {
      this.setState({avatar: nextProps.user.avatar});
    }
  }

  maybeUpdateUser = () => {
    if (
      this.props.user.name !== this.state.name ||
      this.props.user.avatar !== this.state.avatar
    ) {
      this.props.dispatch(
        updateUserInfo({name: this.state.name, avatar: this.state.avatar}),
      );
    }
  };

  render() {
    const {theme, styles} = this.props;

    return (
      <View style={styles.container}>
        <Header title="Settings" onPressBack={this.handleBack} />
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
            <RowButtonGroup
              style={[styles.section, styles.accountButtonContainer]}
              buttons={this.buttons}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  renderThemeInput() {
    const {styles} = this.props;
    const themeKeys = Object.keys(Style.themes);
    const themes = themeKeys.map(k => Style.themes[k]);
    const currentIndex = themes.findIndex(
      theme => theme.label === this.props.theme.label,
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
                themes[i],
              ),
            )}
          </View>
        </View>
      </View>
    );
  }

  renderThemeOption = (isActive, isLast, theme) => {
    const {styles} = this.props;
    const optionStyles = [styles.themeOption, isLast && styles.lastThemeOption];
    const buttonInnerStyles = [
      styles.themeButtonInner,
      isActive && styles.themeButtonInnerActive,
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

  handleBack = () => {
    this.maybeUpdateUser();
    this.props.dispatch(navigateBack());
  };

  handleAboutPress = () => {
    this.props.dispatch(navigateTo('about'));
  };

  handleBlockedUsersPress = () => {
    this.props.dispatch(navigateTo('blockedUsers'));
  };

  handleLogout = () => {
    let message = 'Log out of this device?';

    Alert.alert(
      message,
      null,
      [
        {text: 'Cancel', onPress: () => {}},
        {text: 'Logout', onPress: this.handleLogoutConfirmation},
      ],
      {cancelable: false},
    );
  };

  handleLogoutConfirmation = () => {
    this.props.dispatch(logout());
  };

  handleDeleteAccount = (e, retry) => {
    const message = `Are you sure you want to delete your account?`;

    Alert.alert(message, null, [
      {text: 'Cancel', onPress: () => {}},
      {text: 'Delete', onPress: this.handleDeleteAccountConfirmation},
    ]);
  };

  handleDeleteAccountConfirmation = value => {
    this.props.dispatch(deleteAccount());
  };

  handleThemeChanged = newTheme => {
    this.props.dispatch(changeTheme(newTheme));
  };

  handleProfileChange = newProfile => {
    this.setState(newProfile);
  };

  handleColorPickerInteractionStart = () => {
    this.setState({scrollLocked: true});
  };

  handleColorPickerInteractionEnd = () => {
    this.setState({scrollLocked: false});
  };
}

const getStyles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  content: {
    ...ifIphoneX({paddingBottom: 30}),
  },
  formContainer: {
    padding: Style.values.outerPadding,
  },
  profileEditor: {
    marginBottom: 36,
  },
  themeInputLabel: {
    marginBottom: 6,
  },
  themeOption: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  themeOptionActive: {
    backgroundColor: theme.highlightColor,
  },
  lastThemeOption: {},
  themeButton: {
    width: 30,
    height: 30,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.primaryBorderColor,
    marginRight: 12,
  },
  themeButtonInner: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  themeButtonInnerActive: {
    backgroundColor: theme.primaryBorderColor,
  },
  themeOptionTextContainer: {
    justifyContent: 'center',
  },
  themeOptionText: {
    lineHeight: 18,
  },
  accountButtonContainer: {
    marginTop: 30,
  },
});

let settingsScreenSelector = state => {
  return {
    user: state.user,
  };
};

export default withStyles(getStyles)(
  connect(settingsScreenSelector)(SettingsScreen),
);
