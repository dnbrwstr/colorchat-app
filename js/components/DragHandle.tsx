import React from 'react';
import {
  Animated,
  View,
  Image,
  StyleProp,
  ViewStyle,
  NativeTouchEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {Gateway} from 'react-gateway';
import withStyles, {InjectedStyles, makeStyleCreator} from '../lib/withStyles';
import {Theme} from '../style/themes';

interface DragHandleProps {
  onDragStart?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
  onDragMove?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
  onDragStop?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
  style: StyleProp<ViewStyle>;
  styles: InjectedStyles<typeof getStyles>;
  theme: Theme;
}

class DragHandle extends React.Component<DragHandleProps> {
  static defaultProps = {
    onDragStart: () => {},
    onDragMove: () => {},
    onDragStop: () => {},
  };

  state = {
    animatedScale: new Animated.Value(1),
  };

  render() {
    const {styles} = this.props;

    let transformStyle = {
      transform: [{scale: this.state.animatedScale}],
    };

    return (
      <Gateway into="top">
        <Animated.View
          style={[styles.target, this.props.style, transformStyle]}
          onStartShouldSetResponder={() => true}
          onResponderGrant={this.onDragStart}
          onResponderMove={this.onDragMove}
          onResponderReject={this.onDragStop}
          onResponderTerminate={this.onDragStop}
          onResponderRelease={this.onDragStop}
          onResponderTerminationRequest={() => false}
        >
          <View style={styles.handle} />
        </Animated.View>
      </Gateway>
    );
  }

  onDragStart = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    Animated.spring(this.state.animatedScale, {
      toValue: 0.75,
      friction: 7,
      tension: 150,
    }).start();
    this.props.onDragStart && this.props.onDragStart(e);
  };

  onDragMove = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    this.props.onDragMove && this.props.onDragMove(e);
  };

  onDragStop = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    Animated.spring(this.state.animatedScale, {
      toValue: 1,
      tension: 400,
      friction: 10,
    }).start();
    this.props.onDragStop && this.props.onDragStop(e);
  };
}

const HANDLE_SIZE = 25;

const getStyles = makeStyleCreator((theme: Theme) => ({
  target: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    marginLeft: -30,
    backgroundColor: 'transparent',
  },
  handle: {
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: theme.conversation.dragDotColor,
  },
  image: {
    position: 'absolute',
    top: 5,
    left: 7.5,
    opacity: 0.125,
  },
}));

export default withStyles(getStyles)(DragHandle);
