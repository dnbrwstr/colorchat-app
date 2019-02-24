import React from "react";
import RoundButton from "./RoundButton";
import Style from "../style";
import BaseText from "./BaseText";
import withStyles from "../lib/withStyles";
import PlusIcon from "./PlusIcon";

const PlusButton = props => {
  const { style, styles, textStyle, theme, ...rest } = props;
  return (
    <RoundButton style={[styles.button, style]} {...rest}>
      <PlusIcon
        style={styles.plusIcon}
        strokeColor={theme.primaryButtonTextColor}
        strokeWidth={7}
      />
    </RoundButton>
  );
};

const getStyles = theme => ({
  button: {
    backgroundColor: theme.primaryButtonColor,
    padding: 12
  },
  plusIcon: {
    width: 18,
    height: 18
  }
});

export default withStyles(getStyles)(PlusButton);
