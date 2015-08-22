import React from 'react-native';
import Style from '../style';

let {
  Text,
  View
} = React;

let RecentColorPicker = React.createClass({
  render: function () {
    return (
      <View style={style.container}>
        <Text>Recent</Text>
      </View>
    );
  }
});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'purple'
  }
});

export default RecentColorPicker;
