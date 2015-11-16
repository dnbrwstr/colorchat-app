import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import { appName } from '../config';
import BaseText from './BaseText';
import Header from './Header';
import PressableView from './PressableView';
import { navigateTo } from '../actions/NavigationActions';
import { loadUserInfo, updateUserInfo } from '../actions/AppActions';

let {
  View,
  TextInput,
  PixelRatio,
  ScrollView
} = React;

let SettingsScreen = React.createClass({
  getInitialState: function () {
    return {
      name: this.props.user.name || ''
    };
  },

  componentDidMount: function () {
    this.props.dispatch(loadUserInfo())
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (nextProps.user.name !== this.props.user.name) {
      this.setState({ name: nextProps.user.name });
    }
  },

  handleBack: function () {
    this.props.dispatch(updateUserInfo({ name: this.state.name }));
    this.props.dispatch(navigateTo('inbox'));
  },

  handleInputRowPress: function (inputRef) {
    this.refs[inputRef].focus();
  },

  handleInputBlur: function () {},

  render: function () {
    return (
      <View style={style.container}>
        <Header
          title="Settings"
          showBack={true}
          onBack={this.handleBack}
          backgroundColor={'rgba(255,255,255,.95)'}
          borderColor={Style.values.midLightGray}
        />
        <ScrollView>
          <View style={style.content}>
            <View style={[style.section, style.changeName]}>
              <View style={style.sectionLabelWrapper}>
                <BaseText>Profile</BaseText>
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
                <BaseText>Account</BaseText>
              </View>
              <View style={style.button}>
                <BaseText style={style.buttonText}>Logout</BaseText>
              </View>
              <View style={style.divider}><View style={style.dividerInner}></View></View>
              <View style={style.button}>
                <BaseText style={style.buttonText}>Delete account</BaseText>
              </View>
            </View>

            <View style={[style.section, style.aboutWrapper]}>
              <View style={style.sectionLabelWrapper}>
                <BaseText>ColorChat</BaseText>
              </View>
              <View style={[style.button, style.aboutButton]}>
                <BaseText style={style.buttonText}>About { appName }</BaseText>
              </View>
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
    backgroundColor: Style.values.veryLightGray
  },
  content: {
    ...Style.mixins.contentWrapperBase,
    padding: 0,
    paddingTop: 20,
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
  buttonText: {
    textAlign: 'center',
    color: 'black'
  },
  section: {
    marginBottom: 20,
  },
  sectionLabelWrapper: {
    padding: Style.values.horizontalPadding
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
    user: state.user
  }
}

export default connect(settingsScreenSelector)(SettingsScreen);
