import React from 'react-native';
import Style from '../style';

let {
  Text
} = React;

let BaseText = React.createClass({
  render: function () {
    return (
      <Text style={[
        style.text,
        this.props.style
      ]}>
        { this.props.children }
      </Text>
    );
  }
});

let style = Style.create({
  text: {
    mixins: [Style.mixins.textBase]
  }
});

export default BaseText;
