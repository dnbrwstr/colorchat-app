import React from 'react-native';
import Style from '../style';
import PressableView from './PressableView';

let {
  Animated,
  View,
  Text,
  InteractionManager
} = React;

let ComposeBar = React.createClass({
  getInitialState: function () {
    return {
      animationValue: new Animated.Value(this.props.active ? 1 : 0),
    };
  },

  componentDidUpdate: function (prevProps) {
    if (this.props.active !== prevProps.active) {
      let nextValue = this.props.active ? 1 : 0;

      Animated.timing(this.state.animationValue, {
        toValue: nextValue,
        duration: 250
      }).start();
    }
  },

  render: function () {
    let composeBarStyle = [
      style.composeBar,
      {
        opacity: this.state.animationValue,
        height: this.state.animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Style.values.rowHeight]
        })
      }
    ];

    return (
      <Animated.View style={composeBarStyle}>
        <PressableView style={[style.composeButton, style.composeButtonFirst]} onPress={this.props.onCancel}>
          <Text style={style.composeButtonText}>Cancel</Text>
        </PressableView>
        <PressableView style={style.composeButton} onPress={this.props.onSend}>
          <Text style={style.composeButtonText}>Send</Text>
        </PressableView>
      </Animated.View>
    );
  }
});

let style = Style.create({
  composeBar: {
    height: Style.values.rowHeight,
    backgroundColor: 'rgba(50,50,50,.6)',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  composeButton: {
    flex: 1,
    justifyContent: 'center'
  },
  composeButtonText: {
    ...Style.mixins.textBase,
    color: 'white',
    textAlign: 'center'
  },
  composeButtonFirst: {
    borderRightColor: 'rgba(255,255,255,.03)',
    borderRightWidth: 1
  }
});

export default ComposeBar;
