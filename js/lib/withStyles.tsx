import React, {useMemo, ComponentType} from 'react';
import {StyleSheet, ViewStyle, TextStyle, ImageStyle} from 'react-native';
import {connect, useSelector} from 'react-redux';
import memoize from 'memoize-one';
import {Theme} from '../style/themes';
import {AppState} from '../store/createStore';

const themeSelector = (state: AppState) => ({
  theme: state.ui.theme,
});

const withStyles = (styleFn: (t: Theme) => void) => {
  const getStyles = memoize(theme => StyleSheet.create(styleFn(theme)));

  const ComponentWithStyles = <P extends object>(C: ComponentType<P>) => (
    props: P & {theme: Theme},
  ) => {
    return <C {...(props as P)} styles={getStyles(props.theme)} />;
  };

  return (Component: ComponentType) =>
    connect(themeSelector)(ComponentWithStyles(Component));
};

export type AnyStyleMap = {[K: string]: ViewStyle | TextStyle | ImageStyle};
export type StyleMap<T> = {[K in keyof T]: ViewStyle | TextStyle | ImageStyle};

export const makeStyleCreator = <T extends StyleSheet.NamedStyles<T>>(
  styleFn: (theme: Theme) => StyleSheet.NamedStyles<T>,
) => (theme: Theme) => styleFn(theme);

export const useStyles = <T extends StyleSheet.NamedStyles<T>>(
  styleFn: (theme: Theme) => T,
) => {
  const {theme} = useSelector(themeSelector, (last, next) => {
    return last.theme === next.theme;
  });

  const styles = useMemo(() => {
    return StyleSheet.create(styleFn(theme));
  }, [styleFn, theme]);

  return {theme, styles};
};

export const connectWithStyles = (
  styleFn: (t: Theme) => void,
  ...args: any[]
) => (Component: ComponentType) =>
  withStyles(styleFn)(connect(...args)(Component));

export default withStyles;
