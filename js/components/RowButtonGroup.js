import React, { Component } from "react";
import { View } from "react-native";
import withStyles from "../lib/withStyles";
import Text from "./BaseText";
import Style from "../style";
import PressableView from "./PressableView";

const RowButtonGroup = props => {
  const { style, styles, buttons } = props;

  return (
    <View style={[styles.container, style]}>
      {buttons &&
        buttons.map(b => {
          return (
            <PressableView
              key={b.label}
              style={styles.button}
              activeStyle={styles.buttonActive}
              onPress={b.action}
            >
              <Text>{b.label}</Text>
            </PressableView>
          );
        })}
    </View>
  );
};

const getStyles = theme => ({
  container: {
    borderBottomWidth: Style.values.borderWidth,
    borderBottomColor: theme.secondaryBorderColor
  },
  button: {
    borderTopWidth: Style.values.borderWidth,
    borderTopColor: theme.secondaryBorderColor,
    height: Style.values.rowHeight,
    padding: Style.values.outerPadding,
    justifyContent: "center"
  },
  buttonActive: {
    backgroundColor: theme.highlightColor
  },
  buttonText: {}
});

export default withStyles(getStyles)(RowButtonGroup);
