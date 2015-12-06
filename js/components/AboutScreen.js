import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import TextScreen from './TextScreen';
import BaseText from './BaseText';
import TextLink from './TextLink';
import { navigateTo } from '../actions/NavigationActions';

let {
  View
} = React;

let AboutScreen = React.createClass({
  handleNavigateBack: function () {
    this.props.dispatch(navigateTo('settings'));
  },

  render: function () {
    return (
      <TextScreen
        title="About ColorChat"
        onNavigateBack={this.handleNavigateBack}
      >
        <BaseText>ColorChat is a messaging application that allows you to chat with colors instead of words.{"\n"}</BaseText>
        <BaseText>ColorChat is built by Dan Brewster under the auspices of <TextLink style={style.link} href="http://soft.works">Soft</TextLink>.{"\n"}</BaseText>
        <BaseText>Please contact <TextLink style={style.link} href="mailto:hello@soft.works">hello@soft.works</TextLink> with any questions.</BaseText>
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

export default connect(aboutSelector)(AboutScreen);
