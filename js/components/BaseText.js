import React from 'react-native';
import Style from '../style';

let {
  Text
} = React;

let BaseText = React.createClass({
  render: function () {
    return (
      <Text {...this.props} style={[
        style.text,
        this.props.style
      ]} />
    );
  }
});

let style = Style.create({
  text: {
    mixins: [Style.mixins.textBase]
  }
});

export default BaseText;
