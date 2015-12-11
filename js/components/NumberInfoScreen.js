import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import TextScreen from './TextScreen';
import BaseText from './BaseText';
import { navigateTo } from '../actions/NavigationActions';
import TextLink from './TextLink';

let {
  View,
  LinkingIOS
} = React;

let NumberInfoScreen = React.createClass({
  handleNavigateBack: function () {
    this.props.dispatch(navigateTo('signup'));
  },

  render: function () {
    return (
      <TextScreen
        title="Number usage"
        onNavigateBack={this.handleNavigateBack}
      >
        <BaseText>ColorChat uses your phone number to authenticate you and to connect you with friends already on ColorChat.{"\n"}</BaseText>
        <BaseText>ColorChat does not share your phone number with other users, but will allow them to message you if you're already listed in their contacts.{"\n"}</BaseText>
        <BaseText>ColorChat does not, and will never, share your phone number with third parties for any reason.{"\n"}</BaseText>
        <BaseText>If you have any questions, please contact <TextLink href="mailto:hello@soft.works" style={style.link}>hello@soft.works</TextLink>.</BaseText>
      </TextScreen>
    );
  }
});

let style = Style.create({
  container: {},
  link: {
    textDecorationLine: 'underline'
  }
});

let aboutSelector = state => ({});

export default connect(aboutSelector)(NumberInfoScreen);