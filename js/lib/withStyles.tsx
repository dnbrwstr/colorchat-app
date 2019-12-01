import React, {useMemo, ComponentType, FC} from 'react';
import {StyleSheet, ViewStyle, TextStyle, ImageStyle} from 'react-native';
import {connect, useSelector, DispatchProp} from 'react-redux';
import memoize from 'memoize-one';
import {Theme} from '../style/themes';
import {AppState} from '../store/createStore';
import {Optionalize} from '../lib/TypeUtils';

const themeSelector = (state: AppState) => ({
  theme: state.theme,
});

export type WithStylesProps<T extends (...args: any) => any> = {
  theme?: Theme;
  styles?: InjectedStyles<T>;
};

const withStyles = <T extends StyleSheet.NamedStyles<T>>(
  styleFn: (t: Theme) => T,
) => {
  const getStyles = memoize(theme => StyleSheet.create(styleFn(theme)));
  type Props = WithStylesProps<typeof getStyles>;

  return <P extends Props = Props>(
    WrappedComponent: React.ComponentType<P>,
  ) => {
    const HOC: FC<Optionalize<P, Props>> = props => {
      const {theme} = useSelector(themeSelector, (last, next) => {
        return last.theme === next.theme;
      });
      const styles = getStyles(theme);
      return (
        <WrappedComponent
          theme={theme}
          styles={styles}
          {...(props as P)}
        ></WrappedComponent>
      );
    };
    return HOC;
  };
};

export type InjectedStyles<
  T extends (...args: any) => any
> = StyleSheet.NamedStyles<ReturnType<T>>;
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

export default withStyles;
