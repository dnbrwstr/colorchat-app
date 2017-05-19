import React from 'react';
import {
  Animated,
  Image,
  requireNativeComponent
} from 'react-native';
import Style from '../style';

let PlaceholderMessage = React.createClass({
  render: function () {
    return (
      <Image style={style.image} source={require('../../images/compose-indicator.gif')} />
    );
  },
});

let style = Style.create({
  placeholder: {
    width: 100,
    height: 10,
    margin: 0,
    backgroundColor: 'black'
  }
});

export default PlaceholderMessage;
