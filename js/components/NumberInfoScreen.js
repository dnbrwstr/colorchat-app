import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import TextScreen from './TextScreen';
import BaseText from './BaseText';
import { navigateTo } from '../actions/NavigationActions';

let {
  View
} = React;

let NumberInfoScreen = React.createClass({
  handleNavigateBack: function () {
    this.props.dispatch(navigateTo('signup'));
  },

  render: function () {
    return (
      <TextScreen
        title="Number Usage"
        onNavigateBack={this.handleNavigateBack}
      >
        <BaseText>Hi!</BaseText>
      </TextScreen>
    );
  }
});

let style = Style.create({
  container: {}
});

let aboutSelector = state => ({});

export default connect(aboutSelector)(NumberInfoScreen);