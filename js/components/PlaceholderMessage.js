import React from 'react-native';
import Style from '../style';

let {
  Animated,
  requireNativeComponent
} = React;

let NativePlaceholderComponent = requireNativeComponent('RCTPlaceholderMessage', null);

let PlaceholderMessage = React.createClass({
  render: function () {
    return (
      <NativePlaceholderComponent style={style.placeholder} />
    );
  },
});

let style = Style.create({
  placeholder: {
    width: 100,
    height: 30,
    margin: 0,
  }
});

export default PlaceholderMessage;
