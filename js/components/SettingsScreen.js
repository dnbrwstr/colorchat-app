import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  TextInput,
  PixelRatio,
  ScrollView,
  AlertIOS,
  Dimensions
} from 'react-native';
import Style from '../style';
import config from '../config';
import BaseText from './BaseText';
import Header from './Header';
import PressableView from './PressableView';
import SquareButton from './SquareButton';
import { navigateTo } from '../actions/NavigationActions';
import { loadUserInfo, updateUserInfo, logout, deleteAccount } from '../actions/AppActions';

let { appName } = config;



let SettingsScreen = React.createClass({
  getInitialState: function () {
    return {
      name: this.props.user.name || ''
    };
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (nextProps.user.name !== this.props.user.name) {
      this.setState({ name: nextProps.user.name });
    }
  },

  componentDidUpdate: function (prevProps) {
    if (prevProps.transitioning && !this.props.transitioning) {
      this.props.dispatch(loadUserInfo())
    }
  },

  handleBack: function () {
    this.maybeUpdateUser();
    this.props.dispatch(navigateTo('inbox'));
  },

  handleInputRowPress: function (inputRef) {
    this.refs[inputRef].focus();
  },

  handleLogout: function () {
    let message = 'Log out of this device?';

    AlertIOS.alert(
      message,
      null,
      [{ text: 'Cancel', onPress: () => {} },
      { text: 'Logout', onPress: this.handleLogoutConfirmation }]
    );
  },

  handleLogoutConfirmation: function () {
    this.props.dispatch(logout())
  },

  handleAboutPress: function () {
    this.props.dispatch(navigateTo('about'));
  },

  handleInputBlur: function () {
    this.maybeUpdateUser();
  },

  handleDeleteAccount: function (e, retry) {
    let message = `Enter your phone number (including area code and country code) to delete your account. This is not reversible.`;

    if (retry) message = 'Invalid number. ' + message

    AlertIOS.prompt(
      message,
      [{ text: 'Cancel', onPress: () => {} },
      { text: 'Delete', onPress: this.handleDeleteAccountConfirmation }]
    );
  },

  handleDeleteAccountConfirmation: function (value) {
    let isValidConfirmation =
      '+' + value.replace(/[^0-9]/g, '') === this.props.user.phoneNumber;

    if (isValidConfirmation) {
      this.props.dispatch(deleteAccount());
    } else {
      this.handleDeleteAccount(null, true);
    }
  },

  maybeUpdateUser: function () {
    if (this.props.user.name !== this.state.name) {
      this.props.dispatch(updateUserInfo({ name: this.state.name }));
    }
  },

  render: function () {
    let contentStyles = [style.content, {
      height: Dimensions.get('window').height - Style.values.rowHeight
    }];

    return (
      <View style={style.container}>
        <Header
          title="Settings"
          showBack={true}
          onBack={this.handleBack}
          highlightColor={'#E6E6E6'}
        />
        <ScrollView>
          <View style={contentStyles}>
            <View style={[style.section, style.nameSection]}>
              <View style={style.sectionContent}>
                <PressableView style={style.inputRow} onPress={this.handleInputRowPress.bind(this, 'nameInput')}>
                  <View style={style.inputRowLabel}>
                    <BaseText>Name</BaseText>
                  </View>
                  <View style={style.inputWrapper}>
                    <TextInput
                      ref="nameInput"
                      value={this.state.name}
                      style={style.input}
                      onBlur={this.handleInputBlur.bind(this, 'name')}
                      onChangeText={name => this.setState({name})}
                      value={this.state.name}
                    />
                  </View>
                </PressableView>
              </View>
            </View>

            <View style={[style.section]}>
              <SquareButton
                label="Logout"
                onPress={this.handleLogout}
                style={style.button}
              />
              <SquareButton
                label="Delete account"
                onPress={this.handleDeleteAccount}
                style={style.button}
              />
            </View>

            <View style={[style.section, style.aboutSection]}>
              <PressableView
                label="About ColorChat"
                onPress={this.handleAboutPress}
                style={style.aboutButton}
              >
                <BaseText style={style.aboutButtonText}>About ColorChat</BaseText>
              </PressableView>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    ...Style.mixins.contentWrapperBase,
    padding: 0,
    flex: 1
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50
  },
  inputRowLabel: {
    flex: 0,
    justifyContent: 'center',
    width: 60
  },
  input: {
    ...Style.mixins.inputBase,
    color: 'black',
    paddingTop: 0,
  },
  inputWrapper: {
    flex: 1,
    borderBottomWidth: Style.values.borderWidth,
    borderBottomColor: Style.values.midGray
  },
  button: {
    marginTop: 0,
    marginBottom: 10
  },
  section: {
    flex: 1,
  },
  sectionContent: {
    padding: Style.values.horizontalPadding,
  },
  nameSection: {
    flex: 0,
  },
  aboutSection: {
    flex: 0,
    justifyContent: 'flex-end',
  },
  aboutButton: {
    padding: Style.values.outerPadding,
  },
  aboutButtonText: {
    textAlign: 'center'
  }
});

let settingsScreenSelector = state => {
  return {
    user: state.user,
    transitioning: state.navigation.state === 'transitioning'
  }
}

export default connect(settingsScreenSelector)(SettingsScreen);
