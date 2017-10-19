import React from 'react';
import {
  Linking
} from 'react-native';
import BaseText from './BaseText';

class TextLink extends React.Component {
  handlePress = () => {
    Linking.openURL(this.props.href)
  };

  render() {
    return <BaseText {...this.props} onPress={this.handlePress} />;
  }
}

export default TextLink;
