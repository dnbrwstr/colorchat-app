import React from "react";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import memoize from "memoize-one";

const themeSelector = state => ({
  theme: state.theme
});

const withStyles = styleFn => {
  const getStyles = memoize(theme => StyleSheet.create(styleFn(theme)));

  const ComponentWithStyles = Component => props => (
    <Component {...props} styles={getStyles(props.theme)} />
  );

  return Component => connect(themeSelector)(ComponentWithStyles(Component));
};

export const connectWithStyles = (styleFn, ...args) => Component =>
  withStyles(styleFn)(connect(...args)(Component));

export default withStyles;
