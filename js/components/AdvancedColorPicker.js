import React from 'react-native';
import Style from '../style';

let {
  Text,
  View
} = React;

let AdvancedColorPicker = React.createClass({
  render: function () {
    return (
      <View style={style.container}>
        <Text>Advanced</Text>
      </View>
    );
  }
});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'green'
  }
});

export default AdvancedColorPicker;
