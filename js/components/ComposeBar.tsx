import React, {FC, useMemo, useEffect, useRef} from 'react';
import {Animated, Text, StyleSheet, View} from 'react-native';
import Style from '../style';
import PressableView from './PressableView';
import withStyles, {
  InjectedStyles,
  makeStyleCreator,
  useStyles,
} from '../lib/withStyles';
import {Theme} from '../style/themes';
import {useUpdateEffect} from '../lib/HookUtils';

type ComposeBarProps = {
  active: boolean;
  styles: InjectedStyles<typeof getStyles>;
  theme: Theme;
  onSend: () => void;
  onCancel: () => void;
  onPressCamera: () => void;
};

const ComposeBar: FC<ComposeBarProps> = props => {
  const {styles, theme} = useStyles(getStyles);
  const animationValue = useMemo(() => {
    return new Animated.Value(props.active ? 1 : 0);
  }, []);

  useUpdateEffect(() => {
    let nextValue = props.active ? 1 : 0;
    const animation = Animated.timing(animationValue, {
      toValue: nextValue,
      duration: 250,
    });
    animation.start();
    return () => {
      animation.stop();
    };
  }, [props.active]);

  let composeBarStyle = [
    styles.composeBar,
    {
      opacity: animationValue,
      height: animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Style.values.composeBarHeight],
      }),
      borderTopWidth: animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, StyleSheet.hairlineWidth],
      }),
    },
  ];

  return (
    <Animated.View style={composeBarStyle}>
      <PressableView
        style={[styles.button, styles.buttonFirst]}
        activeStyle={styles.buttonActive}
        onPress={props.onCancel}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Cancel</Text>
        </View>
      </PressableView>
      <PressableView
        style={[styles.button]}
        activeStyle={styles.buttonActive}
        onPress={props.onPressCamera}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Camera</Text>
        </View>
      </PressableView>
      <PressableView
        style={styles.button}
        activeStyle={styles.buttonActive}
        onPress={props.onSend}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Send</Text>
        </View>
      </PressableView>
    </Animated.View>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  composeBar: {
    height: Style.values.composeBarHeight,
    flexDirection: 'row',
    overflow: 'hidden',
    borderTopColor: theme.secondaryBorderColor,
    backgroundColor: theme.backgroundColor,
  },
  button: {
    flex: 1,
    borderLeftColor: theme.secondaryBorderColor,
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  buttonContent: {
    height: Style.values.rowHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...Style.mixins.textBase,
    color: theme.primaryTextColor,
    textAlign: 'center',
  },
  buttonFirst: {
    borderLeftWidth: 0,
  },
  buttonActive: {
    backgroundColor: theme.highlightColor,
  },
}));

export default withStyles(getStyles)(ComposeBar);
