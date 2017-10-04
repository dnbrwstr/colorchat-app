import React from 'react';
import {
  Linking
} from 'react-native';
import BaseText from './BaseText';

let TextLink = React.createClass({
  handlePress: function () {
    Linking.openURL(this.props.href)
  },

  render: function () {
    return <BaseText {...this.props} onPress={this.handlePress} />;
  }
});

export default TextLink;
