import {NativeSyntheticEvent, NativeScrollEvent} from 'react-native';

/**
 * Cuts out the middleman when relaying ScrollView events
 * Good performance, bad practice
 */

type ScrollListener = (e: NativeSyntheticEvent<NativeScrollEvent>) => void;

class ScrollBridge {
  callbacks: ScrollListener[] = [];

  handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.callbacks.forEach(cb => cb(e));
  };

  addScrollListener = (cb: ScrollListener) => {
    this.callbacks.push(cb);
  };

  removeScrollListener = (cb: ScrollListener) => {
    this.callbacks = this.callbacks.filter(c => c !== cb);
  };
}

export default ScrollBridge;
