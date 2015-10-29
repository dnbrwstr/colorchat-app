import React from 'react-native';
import { times } from 'ramda';
import Style from '../style';
import TimerMixin from './mixins/TimerMixin';

let {
  View,
  LayoutAnimation
} = React;

let AnimatedEllipsis = React.createClass({
  mixins: [TimerMixin],

  getDefaultProps: function () {
    return {
      duration: 2000
    };
  },

  getInitialState: function () {
    return {
      dots: 2
    }
  },

  componentDidMount: function () {
    this.setIntervalTimer('update', this.step, this.props.duration);
  },

  componentWillUnmount: function () {
    this.clearAllTimers();
  },

  step: function () {
    let dots = ++this.state.dots;
    if (dots > 3)  dots = 0;

    LayoutAnimation.spring();

    this.setState({
      dots: dots,
    });
  },

  render: function () {
    let dots = times((i) => {
      let dotStyle = [
        style.dot,
        i < this.state.dots && {
          opacity: 1,
          width: 5,
          height: 5,
          borderRadius: 2.5,
          margin: 5/3
        }
      ];

      return (
        <View style={dotStyle} />
      );
    }, 3);

    return (
      <View style={style.container}>{ dots }</View>
    );
  }
});

let size = 2;

let style = Style.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  dot: {
    borderRadius: size / 2,
    margin: size / 3,
    width: size,
    height: size,
    backgroundColor: Style.values.midGray,
    opacity: 0
  }
})

export default AnimatedEllipsis;
