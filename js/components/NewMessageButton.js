import React from 'react-native';
import Style from '../style';
import PressableView from './PressableView';

let {
  View,
  Text,
  Animated
} = React;

const BUTTON_SIZE = 50;

let NewMessageButton = React.createClass({
  getInitialState: function () {
    let initialOpacity = this.props.visible ? 1 : 0;

    return {
      animatedSize: new Animated.Value(1),
      animatedOpacity: new Animated.Value(initialOpacity)
    };
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
          friction: 7,
          tension: 500
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
    if (this.state.leaving || !this.props.visible) return;

    this.setState({
      leaving: true
    });

    let animation = Animated.spring(this.state.animatedSize, {
      toValue: 1,
      friction: 7,
      tension: 500
    })

    animation.start();

    setTimeout(() => {
      animation.stop();
      if (this.props.onPress) this.props.onPress();
      this.setState({
        leaving: false
      });
    }, 200);
  }
});

let style = Style.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'black',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 26,
    marginTop: -5
  }
});

export default NewMessageButton;
