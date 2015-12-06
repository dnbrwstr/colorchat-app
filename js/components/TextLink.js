import React from 'react-native';
import BaseText from './BaseText';

let {
  LinkingIOS
} = React;

let TextLink = React.createClass({
  handlePress: function () {
    LinkingIOS.openURL(this.props.href)
  },

  render: function () {
    return <BaseText {...this.props} onPress={this.handlePress} />;
  }
});

export default TextLink;
