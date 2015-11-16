import React from 'react-native';
import { merge } from 'ramda';
import RoundButton from './RoundButton';
import Style from '../style';
import BaseText from './BaseText';

let {
  Image
} = React;

let SettingsButton = React.createClass({
  render: function () {
    let buttonStyles = [style.button, this.props.style];

    return (
      <RoundButton {...this.props} style={buttonStyles}>
        <Image style={style.image} source={require('../../images/cog-1-dark.png')} />
      </RoundButton>
    );
  }
});

let buttonSize = 50;
let iconSize = 24;
let marginSize = (buttonSize - iconSize) / 2

let style = Style.create({
  button: {
    ...Style.mixins.shadowBase,
    shadowOpacity: .25,
    shadowRadius: 1,
    backgroundColor: '#white'
  },
  image: {
    position: 'absolute',
    top: marginSize,
    left: marginSize,
    width: iconSize,
    height: iconSize,
  }
});

export default SettingsButton;
