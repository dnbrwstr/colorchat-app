import { Animated, Easing, DeviceEventEmitter } from 'react-native';

let KeyboardMixin = {
  getInitialState: function () {
    return {
      keyboardHeight: 0,
      animatedKeyboardHeight: new Animated.Value(0)
    }
  },

  componentDidMount: function () {
    var showListener = DeviceEventEmitter.addListener('keyboardWillShow', (frames) => {
      Animated.timing(this.state.animatedKeyboardHeight, {
        toValue: -frames.endCoordinates.height,
        duration: 175,
        easing: Easing.out(Easing.ease)
      }).start();
    });

    var hideListener = DeviceEventEmitter.addListener('keyboardWillHide', frames => {
      Animated.timing(this.state.animatedKeyboardHeight, {
        toValue: 0,
        duration: 200
      }).start();
    });

    this.setState({
      keyboardShowListener: showListener,
      keyboardHideListener: hideListener
    });
  },

  componentWillUnmount: function () {
    this.state.keyboardShowListener.remove();
    this.state.keyboardHideListener.remove();
  }
};

export default KeyboardMixin;
