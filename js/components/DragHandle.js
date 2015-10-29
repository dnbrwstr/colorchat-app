import React from 'react-native';
import Style from '../style';
import Overlay from 'react-native-overlay';

let {
  Animated,
  View
} = React;

let DragHandle = React.createClass({
  getDefaultProps: function () {
    return {
      onDragStart: () => {},
      onDragMove: () => {},
      onDragStop: () => {}
    };
  },

  render: function () {
    return (
      <Overlay isVisible={true}>
        <Animated.View
          style={[style.target, this.props.style]}
          onStartShouldSetResponder={()=>true}
          onResponderGrant={this.onDragStart}
          onResponderMove={this.onDragMove}
          onResponderReject={this.onDragStop}
          onResponderTerminate={this.onDragStop}
          onResponderRelease={this.onDragStop}
          onResponderTerminationRequest={()=>false}
        >
          <View style={style.handle} />
        </Animated.View>
      </Overlay>
    );
  },

  onDragStart: function (e) {
    this.props.onDragStart(e)
  },

  onDragMove: function (e) {
    this.props.onDragMove(e)
  },

  onDragStop: function (e) {
    this.props.onDragStop(e)
  }
});

let style = Style.create({
  target: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    marginLeft: -30,
    backgroundColor: 'transparent'
  },
  handle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: .124,
    shadowRadius: 10
  }
});

export default DragHandle;
