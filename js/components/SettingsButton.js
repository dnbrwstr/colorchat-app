import React from 'react';
import {
  Image
} from 'react-native';
import { merge } from 'ramda';
import RoundButton from './RoundButton';
import Style from '../style';
import BaseText from './BaseText';



class SettingsButton extends React.Component {
  render() {
    let buttonStyles = [style.button, this.props.style];

    return (
      <RoundButton {...this.props} style={buttonStyles}>
        <Image style={style.image} source={require('../../images/cog-1-dark.png')} />
      </RoundButton>
    );
  }
}

let buttonSize = 50;
let iconSize = 24;
let marginSize = (buttonSize - iconSize) / 2

let style = Style.create({
  button: {
    backgroundColor: 'white'
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
