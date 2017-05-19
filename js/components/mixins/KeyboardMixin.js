import {
  Animated,
  Easing,
  DeviceEventEmitter,
  Dimensions,
  Keyboard
} from 'react-native';

let KeyboardMixin = {
  getInitialState: function () {
    return {
      keyboardHeight: 0,
      keyboardIsAnimating: false,
      animatedKeyboardHeight: new Animated.Value(0),
      animatedKeyboardEmptySpace: new Animated.Value(Dimensions.get('window').height),
      keyboardShowListener: null,
      keyboardHideListener: null
    }
  },

  componentDidMount: function () {
    var showListener = Keyboard.addListener('keyboardWillShow', (frames) => {
      if (this.keyboardMixinHandleKeyboardWillShow) this.keyboardMixinHandleKeyboardWillShow(frames);

      this.animate({
        toValue: frames.endCoordinates.height,
        duration: frames.duration,
        easing: Easing.inOut(Easing.ease)
      }, frames.duration);
    });

    var hideListener = Keyboard.addListener('keyboardWillHide', frames => {
      if (this.keyboardMixinHandleKeyboardWillHide) this.keyboardMixinHandleKeyboardWillHide(frames);

      this.animate({
        toValue: 0,
        duration: 200
      }, frames.duration);
    });

    this.setState({
      keyboardShowListener: showListener,
      keyboardHideListener: hideListener
    });
  },

  animate: function (options, nativeDuration) {
    let {
      toValue,
      duration,
      easing
    } = options;

    this.setState({
      keyboardIsAnimating: true
    });

    Animated.parallel([
      Animated.timing(this.state.animatedKeyboardEmptySpace, {
        toValue: Dimensions.get('window').height - toValue,
        duration,
        easing
      }),
      Animated.timing(this.state.animatedKeyboardHeight, {
        toValue,
        duration,
        easing
      })
    ]).start();

    setTimeout(() => {
      this.setState({
        keyboardIsAnimating: false,
        keyboardHeight: -toValue
      });
    }, nativeDuration);
  },

  componentWillUnmount: function () {
    this.state.keyboardShowListener.remove();
    this.state.keyboardHideListener.remove();
  }
};

export default KeyboardMixin;
