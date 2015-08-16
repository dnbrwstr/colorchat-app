import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';

let {
  View,
  Text
} = React;

let MainScreen = React.createClass({

  componentWillUpdate: function () {

  },

  render: function () {
    return (
      <View>
        <Text>YOU MADE IT</Text>
      </View>
    );
  }
});

export default connect(state => ({
  route: state.navigation.route,
  contacts: state.contacts,
  conversation: state.conversations
}))(MainScreen);