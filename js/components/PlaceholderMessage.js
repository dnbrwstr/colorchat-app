import React from 'react-native';
import Style from '../style';

let {
  Animated
} = React;

let PlaceholderMessage = React.createClass({

  getInitialState: function () {
    return {
      offset: new Animated.Value(20),
      height: new Animated.Value(0)
    };
  },

  componentDidMount: function () {
    Animated.timing(this.state.height, {
      toValue: 10,
      duration: 100
    }).start(this.oscillate);
  },

  oscillate: function () {
    let inAnimation = Animated.timing(this.state.offset, {
      toValue: 80,
      duration: 200
    });

    let outAnimation = Animated.timing(this.state.offset, {
      toValue: 20,
      duration: 200
    });

    this.setState({ animation: inAnimation });

    inAnimation.start(() => {
      this.setState({ animation: outAnimation })

      setTimeout(() => {
        outAnimation.start(this.oscillate);
      } , 10);
    });
  },

  render: function () {
    let placeholderStyles = [
      style.placeholder,
      {
        height: this.state.height,
        marginLeft: this.state.offset
      }
    ];

    return (
      <Animated.View style={placeholderStyles}>

      </Animated.View>
    );
  },
});

let style = Style.create({
  placeholder: {
    width: 10,
    height: 10,
    margin: 20,
    backgroundColor: '#333'
  }
});

export default PlaceholderMessage;
