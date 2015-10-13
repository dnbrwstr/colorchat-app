import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import DragHandle from './DragHandle';
import { updateWorkingMessage } from '../actions/MessageActions';
import SimpleColorPicker from './SimpleColorPicker';

let {
  View,
  Dimensions,
  Animated,
  InteractionManager,
  Text
} = React;

let EditableMessage = React.createClass({
  getInitialState: function () {
    return {
      workingHeight: this.props.height,
      workingWidth: this.props.width,
      workingColor: this.props.color,
      animatedHeight: new Animated.Value(0),
      animatedOpacity: new Animated.Value(0)
    };
  },

  shouldComponentUpdate: function (prevProps, prevState) {
    return prevState !== this.state ||
      prevProps.composing !== this.props.composing ||
      prevProps.routeName !== this.props.routeName ||
      prevProps.navigationState !== this.props.navigationState;
  },

  componentWillReceiveProps: function (nextProps) {
    let stoppedComposing = this.props.composing && !nextProps.composing;
    let navigatedAway = this.props.routeName === 'conversation' &&
      nextProps.routeName !== 'conversation';
    let navigatedBack = nextProps.routeName === 'conversation' &&
      nextProps.navigationState === 'ready';

    if (stoppedComposing || navigatedAway) {
      this.state.animatedOpacity.setValue(0);
    } else if (navigatedBack) {
      Animated.timing(this.state.animatedOpacity, {
        toValue: 1,
        duration: 200
      }).start();
    }
  },

  componentDidMount: function () {
    let animations = [Animated.timing(this.state.animatedHeight, {
      toValue: 1,
      duration: 200
    })];

    if (this.shouldShowHandles()) {
      animations.push(Animated.timing(this.state.animatedOpacity, {
        toValue: 1,
        duration: 200
      }));
    }

    Animated.sequence(animations).start();
  },

  render: function () {
    let messageStyle = this.shouldShowHandles() ? {
      width: this.state.workingWidth,
      height: this.state.animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.state.workingHeight]
      }),
      backgroundColor: this.state.workingColor
    } : {
      width: this.props.width,
      height: this.props.height,
      backgroundColor: this.props.color
    };

    let messageStyles = [{
      ...messageStyle,
      overflow: 'visible',
      alignSelf: 'flex-end'
    }];

    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;
    let width = this.state.workingWidth;
    let height = this.state.workingHeight;
    let verticalOffset = Style.values.rowHeight;

    let top = screenHeight - height - verticalOffset;
    let left = screenWidth - width;
    let verticalMidpoint = top + (height / 2);
    let horizontalMidpoint = left + (width / 2);

    let topValue = this.state.animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [screenHeight - verticalOffset, top]
    });

    let verticalMidpointValue = this.state.animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [screenHeight - verticalOffset, verticalMidpoint]
    });

    let handleBase = {
      position: 'absolute',
      opacity: this.state.animatedOpacity
    };

    let horizontalHandleStyle = {
      ...handleBase,
      top: verticalMidpointValue,
      left: left
    };

    let verticalHandleStyle = {
      ...handleBase,
      top: topValue,
      left: horizontalMidpoint,
    };

    let diagonalHandleStyle = {
      ...handleBase,
      top: topValue,
      left: left
    };

    /**
     * Render instructions if this is the first
     * message created & it hasn't yet been modified
     */
    let shouldShowInstructions = this.props.messageCount === 1;

    return (
      <Animated.View style={messageStyles}>
        { this.shouldShowHandles() &&
          <View style={{flex: 1}}>
            <SimpleColorPicker
              showInstructions={shouldShowInstructions}
              style={{flex: 1}}
              onChange={this.onColorChange}
              initialValue={this.state.workingColor} />
            <DragHandle style={horizontalHandleStyle}
              ref="horizontalHandle"
              onDragMove={this.onDragHandle.bind(this, 'horizontal')}
              onDragStop={this.onDragStop}
            />
            <DragHandle style={verticalHandleStyle}
              ref="verticalHandle"
              onDragMove={this.onDragHandle.bind(this, 'vertical')}
              onDragStop={this.onDragStop}
            />
            <DragHandle style={diagonalHandleStyle}
              ref="diagonalHandle"
              onDragMove={this.onDragHandle.bind(this, 'diagonal')}
              onDragStop={this.onDragStop}
            />
          </View>
        }
      </Animated.View>
    );
  },

  shouldShowHandles: function () {
    return this.props.state === 'composing' &&
      this.props.routeName === 'conversation' &&
      this.props.navigationState === 'ready';
  },

  onDragHandle: function (axis, e) {
    let screenWidth = Dimensions.get('window').width;
    let screenHeight = Dimensions.get('window').height;
    let nextState = {};

    if (axis === 'vertical' || axis === 'diagonal') {
      nextState.workingHeight = screenHeight - e.nativeEvent.pageY - Style.values.rowHeight;
    }

    if (axis === 'horizontal' || axis === 'diagonal') {
      nextState.workingWidth = screenWidth - e.nativeEvent.pageX;
    }

    this.setState(nextState);
  },

  onDragStop: function () {
    this.props.dispatch(updateWorkingMessage({
      color: this.state.workingColor,
      height: this.state.workingHeight,
      width: this.state.workingWidth
    }));
  },

  onColorChange: function (color) {
    this.setState({
      workingColor: color
    });

    this.props.dispatch(updateWorkingMessage({
      color: color
    }));
  }
});

let style = Style.create({
  message: {}
});

let selectData = state => {
  return {
    messageCount: state.messages.length,
    composing: state.ui.conversation.composing,
    routeName: state.navigation.route.title,
    navigationState: state.navigation.state
  };
};

export default connect(selectData)(EditableMessage);
