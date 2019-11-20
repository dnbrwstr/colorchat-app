import React, {FC} from 'react';
import {TextInput, TextInputProps} from 'react-native';
import Style from '../style';
import {useStyles} from '../lib/withStyles';
import {Theme} from '../style/themes';

const BaseTextInput: FC<TextInputProps> = props => {
  const {styles} = useStyles(getStyles);
  const {style, ...inputProps} = props;
  return (
    <TextInput
      {...inputProps}
      style={[styles.input, style]}
      underlineColorAndroid="transparent"
    />
  );
};

const getStyles = (theme: Theme) => ({
  input: {
    ...Style.mixins.inputBase,
    color: theme.primaryTextColor,
    height: Style.values.buttonHeight,
  },
});

export default BaseTextInput;
