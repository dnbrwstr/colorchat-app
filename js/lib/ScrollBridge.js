/**
 * Cuts out the middleman when relaying ScrollView events
 * Good performance, bad practice
 */
class ScrollBridge {
  constructor() {
    this.callbacks = [];
  };

  handleScroll = e => {
    this.callbacks.forEach(cb => cb(e));
  };

  addScrollListener = cb => {
    this.callbacks.push(cb);
  };

  removeScrollListener = cb => {
    this.callbacks = this.callbacks.filter(c => c !== cb);
  };
};

export default ScrollBridge;
