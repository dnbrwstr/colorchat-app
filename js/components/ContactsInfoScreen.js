import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import TextScreen from './TextScreen';
import TextLink from './TextLink';
import BaseText from './BaseText';
import { navigateTo } from '../actions/NavigationActions';

let {
  View
} = React;

let ContactsInfoScreen = React.createClass({
  handleNavigateBack: function () {
    this.props.dispatch(navigateTo('contacts'));
  },

  render: function () {
    return (
      <TextScreen
        title="Contacts usage"
        onNavigateBack={this.handleNavigateBack}
      >
        <BaseText>ColorChat uses your contacts to show you which of your friends are already using ColorChat{"\n"}</BaseText>
        <BaseText>ColorChat does not store your contacts, and does not share them with other users or with third parties for any reason.{"\n"}</BaseText>
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

export default connect(aboutSelector)(ContactsInfoScreen);