import React from 'react-native';
import RoundButton from './RoundButton';
import Style from '../style';
import BaseText from './BaseText';

let PlusButton = React.createClass({
  render: function () {
    return (
      <RoundButton {...this.props}>
        <BaseText style={style.text}>+</BaseText>
      </RoundButton>
    );
  }
});

let style = Style.create({
  text: {
    color: 'white',
    fontSize: 26,
    marginTop: -5
  }
});

export default PlusButton;
