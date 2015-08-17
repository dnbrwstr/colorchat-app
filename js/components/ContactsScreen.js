import React from 'react-native';
import Style from '../style';
import { connect } from 'react-redux/native';

let {
  View,
  Text
} = React;

let ContactsScreen = React.createClass({
  render: function () {
    return (
      <View style={style.container}>
        <Text>Contacts</Text>
      </View>
    );
  }
});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'maroon',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

let selectContacts = state => state.contacts;

export default connect(selectContacts)(ContactsScreen);
