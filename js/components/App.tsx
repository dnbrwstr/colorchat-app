import React, {FC, useState, useEffect} from 'react';
import {View, Animated, StyleSheet, Platform} from 'react-native';
import {GatewayDest} from 'react-gateway';
import Router from './Router';
import OfflineMessage from './OfflineMessage';
import FunctionView from './FunctionView';
import {useStyles, makeStyleCreator} from '../lib/withStyles';
import {getStatusBarHeight, ifIphoneX} from 'react-native-iphone-x-helper';
import {Theme} from '../style/themes';

const App: FC = () => {
  const {styles} = useStyles(getStyles);
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, {opacity}]}>
      <View style={styles.containerInner}>
        <OfflineMessage />
        <Router />

        {/*
        Gateway dest typedef is missing style prop...
        // @ts-ignore */}
        <GatewayDest
          name="top"
          component={FunctionView}
          style={styles.gateway}
        />
      </View>
    </Animated.View>
  );
};

export default App;

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    ...Platform.select({
      ios: {paddingTop: getStatusBarHeight()},
      android: {},
    }),
  },
  containerInner: {
    flex: 1,
    ...ifIphoneX(
      {},
      {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.secondaryBorderColor,
      },
    ),
  },
  gateway: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));
