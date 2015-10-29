let getHandle = (name, suffix) => `${name}Timer${suffix}`;

let TimerMixin = {
  setDelayTimer: function (name, fn, duration) {
    let handle = getHandle(name, 'Delay');
    this.setState({
      [handle]: setTimeout(fn, duration)
    });
  },

  clearDelayTimer: function (name) {
    let handle = getHandle(name, 'Delay');
    clearTimeout(this.state[handle]);
    this.setState({ [handle]: null });
  },

  setIntervalTimer: function (name, fn, duration) {
    let handle = getHandle(name, 'Interval');
    this.setState({
      [handle]: setInterval(fn, duration)
    });
  },

  clearIntervalTimer: function () {
    let handle = getHandle(name, 'Interval');
    clearInterval(handle);
    this.setState({ [handle]: null });
  },

  setThrottleTimer: function (name, fn, duration) {
    let handle = getHandle(name, 'Throttle');

    if (this.state[handle]) return;

    this.setState({
      [handle]: setTimeout(fn, duration)
    });
  },

  setDebounceTimer: function (name, fn, duration) {
    let handle = getHandle(name, 'Debounce');

    if (this.state[handle]) {
      clearTimeout(this.state[handle]);
    }

    this.setState({
      [handle]: setTimeout(fn, duration)
    });
  },

  clearAllTimers: function () {
    Object.keys(this.state).forEach(key => {
      if (key.match(/Timer(Delay|Throttle|Debounce)/)) {
        clearTimeout(this.state[key]);
      } else if (key.match(/TimerInterval/)) {
        clearInterval(this.state[key])
      }
    });
  }
};

export default TimerMixin;
