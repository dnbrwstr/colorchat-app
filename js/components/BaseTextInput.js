import React, { Component } from 'react';
import { TextInput } from 'react-native';
import Style from '../style';

class BaseTextInput extends Component {
  render() {
    return <TextInput
      { ...this.props }
      ref="input"
      style={[Style.mixins.inputBase, this.props.style]}
      underlineColorAndroid="transparent"
    />
  }

  blur() {
    this.refs.input.blur();
  }
};

export default BaseTextInput;
