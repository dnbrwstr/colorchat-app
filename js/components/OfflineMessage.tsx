import React, {FC} from 'React';
import {Animated, View} from 'react-native';
import {useStyles, makeStyleCreator} from '../lib/withStyles';
import BaseText from './BaseText';
import Style from '../style';
import {useSelector} from 'react-redux';
import {AppState} from '../store/createStore';
import {Theme} from '../style/themes';
import {useAnimatedValue, useUpdateEffect} from '../lib/HookUtils';

interface OfflineMessageProps {}

const getOfflineState = (state: AppState) => state.ui.network === 'none';

const OfflineMessage: FC<OfflineMessageProps> = props => {
  const {styles} = useStyles(getStyles);
  const isOffline = useSelector(getOfflineState);
  const height = useAnimatedValue(isOffline ? 40 : 0);

  useUpdateEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (isOffline) {
      animation = Animated.timing(height, {
        toValue: 40,
        duration: 200,
      });
    } else {
      animation = Animated.timing(height, {
        toValue: 0,
        duration: 200,
      });
    }
    animation.start();
    return () => animation.stop();
  }, [isOffline]);

  let style = [styles.container, {height}];

  return (
    <Animated.View style={style}>
      <View style={styles.content}>
        <BaseText style={styles.text}>Unable to connect to network</BaseText>
      </View>
    </Animated.View>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    backgroundColor: theme.primaryButtonColor,
    alignItems: 'center',
  },
  content: {
    height: 40,
    justifyContent: 'center',
  },
  text: {
    ...Style.mixins.textBase,
    color: theme.primaryButtonTextColor,
    textAlign: 'center',
    alignItems: 'center',
    lineHeight: 20,
  },
}));

const MemoizedOfflineMessage = React.memo(OfflineMessage);

export default MemoizedOfflineMessage;
