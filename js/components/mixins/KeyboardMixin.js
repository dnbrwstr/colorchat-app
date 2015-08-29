import { Animated, Easing } from 'react-native';
import KeyboardEvents from 'react-native-keyboardevents';

let keyboard = KeyboardEvents.Emitter;

let {
  KeyboardWillShowEvent,
  KeyboardDidShowEvent,
  KeyboardWillHideEvent,
  KeyboadDidHideEvent
} = KeyboardEvents;

let KeyboardMixin = {
  getInitialState: function () {
    return {
      keyboardHeight: 0,
      animatedKeyboardHeight: new Animated.Value(0)
    }
  },

  componentDidMount: function () {
    keyboard.on(KeyboardWillShowEvent, (frames) => {
      Animated.timing(this.state.animatedKeyboardHeight, {
        toValue: -frames.end.height,
        duration: 175,
        easing: Easing.out(Easing.ease)
      }).start();
    });

    keyboard.on(KeyboardWillHideEvent, frames => {
      Animated.timing(this.state.animatedKeyboardHeight, {
        toValue: 0,
        duration: 200
      }).start();
    });
  },

  componentWillUnmount: function () {
    keyboard.off(KeyboardWillShowEvent);
    keyboard.off(KeyboardDidShowEvent);
  }
};

export default KeyboardMixin;
