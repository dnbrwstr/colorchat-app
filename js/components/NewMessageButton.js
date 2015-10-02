import React from 'react-native';
import Style from '../style';
import PressableView from './PressableView';

let {
  View,
  Text,
  Animated
} = React;

let NewMessageButton = React.createClass({
  getInitialState: function () {
    return {
      animatedSize: new Animated.Value(1),
      animatedOpacity: new Animated.Value(1)
    }
  },

  componentDidUpdate: function (prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.state.animatedSize.setValue(.75);

      Animated.parallel([
        Animated.timing(this.state.animatedOpacity, {
          toValue: 1,
          duration: 200
        }),
        Animated.spring(this.state.animatedSize, {
          toValue: 1,
          tension: 300
        })
      ]).start();
    } else if (prevProps.visible && !this.props.visible){
      Animated.timing(this.state.animatedOpacity, {
        toValue: 0,
        duration: 200
      }).start();
    }
  },

  render: function () {
    let viewStyles = [
      style.button,
      {
        opacity: this.state.animatedOpacity,
        transform: [{
          scale: this.state.animatedSize
        }]
      }
    ];

    return (
      <PressableView
        style={viewStyles}
        onPressIn={this.onPressIn}
        onPress={this.onPress}
      >
        <Text style={style.buttonText}>+</Text>
      </PressableView>
    );
  },

  onPressIn: function () {
    Animated.spring(this.state.animatedSize, {
      toValue: .75,
      friction: 7,
      tension: 150
    }).start();
  },

  onPress: function () {
    let animation = Animated.spring(this.state.animatedSize, {
      toValue: 1,
      friction: 7,
      tension: 300
    })

    animation.start();

    setTimeout(() => {
      animation.stop();
      if (this.props.onPress) this.props.onPress();
    }, 200);
  }
});

let size = 44;

let style = Style.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Style.values.darkGray,
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    marginTop: -4
  }
});

export default NewMessageButton;
