import React from 'react';
import {
  View,
  Dimensions,
  Animated,
  StyleProp,
  ViewStyle,
  NativeTouchEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {connect} from 'react-redux';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import Style from '../style';
import DragHandle from './DragHandle';
import {updateWorkingMessage} from '../store/messages/actions';
import SimpleColorPicker from './SimpleColorPicker';
import {constrain} from '../lib/Utils';
import {withScreenFocusState, FocusState} from './ScreenFocusState';
import {getFocusStateChange} from '../lib/NavigationUtils';
import {AppDispatch, AppState} from '../store/createStore';
import {Message} from '../store/messages/types';

const MIN_MESSAGE_HEIGHT = 50;
const MAX_MESSAGE_HEIGHT = 400;
const MIN_MESSAGE_WIDTH = 50;
const MAX_MESSAGE_WIDTH = 290;

const handleAxes = ['horizontal', 'vertical', 'diagonal'] as const;

type HandleAxis = typeof handleAxes[number];

interface EditableMessageProps {
  composing: boolean;
  screenFocusState: FocusState;
  messageCount: number;
  message: Message;
  dispatch: AppDispatch;
}

interface EditableMessageState {
  workingHeight: number;
  workingWidth: number;
  workingColor: string;
  animatedHeight: Animated.Value;
  animatedOpacity: Animated.Value;
}

class EditableMessage extends React.Component<
  EditableMessageProps,
  EditableMessageState
> {
  state = {
    workingHeight: this.props.message.height,
    workingWidth: this.props.message.width,
    workingColor: this.props.message.color,
    animatedHeight: new Animated.Value(0),
    animatedOpacity: new Animated.Value(0),
  };

  componentDidMount() {
    let animations = [
      Animated.timing(this.state.animatedHeight, {
        toValue: 1,
        duration: 200,
      }),
    ];

    if (this.shouldShowHandles()) {
      animations.push(
        Animated.timing(this.state.animatedOpacity, {
          toValue: 1,
          duration: 200,
        }),
      );
    }

    Animated.sequence(animations).start();
  }

  shouldComponentUpdate(
    nextProps: EditableMessageProps,
    nextState: EditableMessageState,
  ) {
    return (
      nextState !== this.state ||
      nextProps.composing !== this.props.composing ||
      nextProps.screenFocusState !== this.props.screenFocusState ||
      nextProps.message.type !== this.props.message.type ||
      nextProps.message.width !== this.props.message.width ||
      nextProps.message.height !== this.props.message.height
    );
  }

  componentDidUpdate(prevProps: EditableMessageProps) {
    const {message: lastMessage} = prevProps;
    const {message} = this.props;
    let stoppedComposing = prevProps.composing && !this.props.composing;

    if (
      lastMessage.width !== message.width ||
      lastMessage.height !== message.height
    ) {
      this.setState({
        workingWidth: message.width,
        workingHeight: message.height,
      });
    }

    const change = getFocusStateChange(
      prevProps.screenFocusState,
      this.props.screenFocusState,
    );

    if (stoppedComposing || change.exited) {
      this.state.animatedOpacity.setValue(0);
    } else if (change.entered) {
      this.state.animatedOpacity.setValue(0);
      Animated.timing(this.state.animatedOpacity, {
        toValue: 1,
        duration: 200,
        delay: 300,
      }).start();
    }
  }

  render() {
    let messageStyle = {
      width: this.state.workingWidth,
      height: this.state.animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.state.workingHeight],
      }),
      backgroundColor:
        this.props.message.type === 'picture'
          ? this.props.message.color
          : this.state.workingColor,
    };

    let messageStyles = [
      style.message,
      {
        ...messageStyle,
        alignSelf: 'flex-end',
      },
      this.props.message.type === 'picture' && style.photoMessage,
    ];

    // Render instructions if this is the first
    // message created & it hasn't yet been modified
    let shouldShowInstructions = this.props.messageCount === 1;

    return (
      <Animated.View style={messageStyles}>
        {this.props.message.type !== 'picture' && (
          <SimpleColorPicker
            showInstructions={shouldShowInstructions}
            style={{flex: 1}}
            onChange={this.onColorChange}
            initialValue={this.state.workingColor}
          />
        )}
        {this.shouldShowHandles() && this.renderHandles()}
      </Animated.View>
    );
  }

  renderHandles() {
    const statusBarHeight = getStatusBarHeight();
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height - statusBarHeight;
    const width = this.state.workingWidth;
    const height = this.state.workingHeight;
    const verticalOffset = Style.values.composeBarHeight;

    const top = screenHeight - height - verticalOffset;
    const left = screenWidth - width;
    const verticalMidpoint = top + height / 2 + 6;
    const horizontalMidpoint = left + width / 2 + 6;

    const topValue = this.state.animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [screenHeight - verticalOffset, top],
    });

    const verticalMidpointValue = this.state.animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [screenHeight - verticalOffset, verticalMidpoint],
    });

    const handleBase = {
      position: 'absolute',
      opacity: this.state.animatedOpacity,
    };

    const handleStyles = {
      horizontal: {
        ...handleBase,
        top: verticalMidpointValue,
        left: left,
      },
      vertical: {
        ...handleBase,
        top: topValue,
        left: horizontalMidpoint,
      },
      diagonal: {
        ...handleBase,
        top: topValue,
        left: left,
      },
    } as const;

    return handleAxes.map(handle => {
      const style = (handleStyles[handle] as any) as StyleProp<ViewStyle>;
      return (
        <DragHandle
          key={`${handle}-handle`}
          style={style}
          onDragMove={e => this.onDragHandle(handle, e)}
          onDragStop={this.onDragStop}
        />
      );
    });
  }

  shouldShowHandles = () => {
    return this.props.screenFocusState === 'focused';
  };

  onDragHandle = (
    axis: HandleAxis,
    e: NativeSyntheticEvent<NativeTouchEvent>,
  ) => {
    const statusBarHeight = getStatusBarHeight();
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const nextState = {
      workingHeight: this.state.workingHeight,
      workingWidth: this.state.workingWidth,
    };

    if (axis === 'vertical' || axis === 'diagonal') {
      nextState.workingHeight = constrain(
        screenHeight -
          e.nativeEvent.pageY -
          Style.values.rowHeight -
          statusBarHeight,
        MIN_MESSAGE_HEIGHT,
        MAX_MESSAGE_HEIGHT,
      );
    }

    if (axis === 'horizontal' || axis === 'diagonal') {
      nextState.workingWidth = constrain(
        screenWidth - e.nativeEvent.pageX,
        MIN_MESSAGE_WIDTH,
        screenWidth,
      );
    }

    this.setState(nextState);
  };

  onDragStop = () => {
    this.props.dispatch(
      updateWorkingMessage(this.props.message, {
        color:
          this.props.message.type === 'picture'
            ? this.props.message.color
            : this.state.workingColor,
        height: this.state.workingHeight,
        width: this.state.workingWidth,
      }),
    );
  };

  onColorChange = (color: string) => {
    this.setState({
      workingColor: color,
    });

    this.props.dispatch(
      updateWorkingMessage(this.props.message, {
        color: color,
      }),
    );
  };
}

let style = Style.create({
  message: {
    flex: 0,
    overflow: 'hidden',
  },
  photoMessage: {
    borderTopLeftRadius: 1000,
    borderBottomLeftRadius: 1000,
  },
});

let selectData = (state: AppState) => {
  return {
    messageCount: state.messages.total,
    composing: state.ui.conversation.composing,
  };
};

export default withScreenFocusState(connect(selectData)(EditableMessage));
