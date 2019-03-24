import React from "react";
import RoundButton from "./RoundButton";
import withStyles from "../lib/withStyles";
import PlusIcon from "./PlusIcon";

const PlusButton = props => {
  const { style, styles, textStyle, theme, ...rest } = props;
  return (
    <RoundButton contentStyle={[styles.button, style]} {...rest}>
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
    width: 16,
    height: 16
  }
});

export default withStyles(getStyles)(PlusButton);
