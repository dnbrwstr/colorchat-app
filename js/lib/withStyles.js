import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {connect, useSelector} from 'react-redux';
import memoize from 'memoize-one';

const themeSelector = state => ({
  theme: state.ui.theme,
});

const withStyles = styleFn => {
  const getStyles = memoize(theme => StyleSheet.create(styleFn(theme)));

  const ComponentWithStyles = Component => props => (
    <Component {...props} styles={getStyles(props.theme)} />
  );

  return Component => connect(themeSelector)(ComponentWithStyles(Component));
};

export const useStyles = styleFn => {
  const {theme} = useSelector(themeSelector, (last, next) => {
    return last.theme === next.theme;
  });

  const styles = useMemo(() => {
    return StyleSheet.create(styleFn(theme));
  }, [styleFn, theme]);

  return {theme, styles};
};

export const connectWithStyles = (styleFn, ...args) => Component =>
  withStyles(styleFn)(connect(...args)(Component));

export default withStyles;
