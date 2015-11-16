import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import { appName } from '../config';
import BaseText from './BaseText';
import Header from './Header';
import PressableView from './PressableView';
import { navigateTo } from '../actions/NavigationActions';
import { loadUserInfo, updateUserInfo, logout, deleteAccount } from '../actions/AppActions';

let {
  View,
  TextInput,
  PixelRatio,
  ScrollView,
  AlertIOS
} = React;

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
    this.props.dispatch(logout())
  },

  handleAboutPress: function () {},

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
    return (
      <View style={style.container}>
        <Header
          title="Settings"
          showBack={true}
          onBack={this.handleBack}
        />
        <ScrollView>
          <View style={style.content}>
            <View style={[style.section, style.changeName]}>
              <View style={style.sectionLabelWrapper}>
                <BaseText style={style.sectionLabelText}>PROFILE</BaseText>
              </View>
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
            <View style={[style.section, style.deleteAccountWrapper]}>
              <View style={style.sectionLabelWrapper}>
                <BaseText style={style.sectionLabelText}>ACCOUNT</BaseText>
              </View>
              <PressableView style={style.button} activeStyle={style.buttonActive} onPress={this.handleLogout}>
                <BaseText style={style.buttonText}>Logout</BaseText>
              </PressableView>
              <View style={style.divider}><View style={style.dividerInner}></View></View>
              <PressableView style={style.button} activeStyle={style.buttonActive} onPress={this.handleDeleteAccount}>
                <BaseText style={style.buttonText}>Delete account</BaseText>
              </PressableView>
            </View>

            <View style={[style.section, style.aboutWrapper]}>
              <View style={style.sectionLabelWrapper}>
                <BaseText style={style.sectionLabelText}>{ appName.toUpperCase()  }</BaseText>
              </View>
              <PressableView style={[style.button, style.aboutButton]} activeStyle={style.buttonActive} onPress={this.handleAboutPress}>
                <BaseText style={style.buttonText}>About { appName }</BaseText>
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
    backgroundColor: Style.values.lightGray
  },
  content: {
    ...Style.mixins.contentWrapperBase,
    padding: 0,
    paddingBottom: 40
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputRowLabel: {
    flex: 1,
    justifyContent: 'center'
  },
  input: {
    ...Style.mixins.inputBase,
    color: 'black',
    paddingTop: 0
  },
  inputWrapper: {
    flex: 1
  },
  button: {
    height: Style.values.rowHeight,
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  buttonActive: {
    backgroundColor: Style.values.veryLightGray
  },
  buttonText: {
    textAlign: 'center',
    color: 'black'
  },
  section: {
  },
  sectionLabelWrapper: {
    padding: Style.values.horizontalPadding,
    paddingBottom: 10,
    paddingTop: 20
  },
  sectionLabelText: {
    fontSize: 12,
    letterSpacing: 1
  },
  sectionContent: {
    backgroundColor: 'white',
    padding: Style.values.horizontalPadding,
  },
  divider: {
    backgroundColor: 'white',
    paddingHorizontal: Style.values.horizontalPadding
  },
  dividerInner: {
    borderBottomWidth: Style.values.borderWidth,
    borderBottomColor: Style.values.midLightGray
  }
});

let settingsScreenSelector = state => {
  return {
    user: state.user,
    transitioning: state.navigation.transitioning
  }
}

export default connect(settingsScreenSelector)(SettingsScreen);
