import React, { Component } from "react";
import { TextInput, StyleSheet } from "react-native";
import Style from "../style";
import withStyles from "../lib/withStyles";

class BaseTextInput extends Component {
  render() {
    const { style, styles, ...props } = this.props;
    return (
      <TextInput
        {...props}
        ref="input"
        style={[styles.input, style]}
        underlineColorAndroid="transparent"
      />
    );
  }

  blur() {
    this.refs.input.blur();
  }
}

const getStyles = theme => ({
  input: {
    ...Style.mixins.inputBase,
    color: theme.primaryTextColor
  }
});

export default withStyles(getStyles)(BaseTextInput);
