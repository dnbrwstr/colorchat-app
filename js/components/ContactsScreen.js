import React from 'react-native';
import Style from '../style';
import { connect } from 'react-redux/native';
import Pressable from './Pressable';
import ContactListView from './ContactListView';
import { importContacts } from '../actions/ContactsActions';
import { navigateTo } from '../actions/NavigationActions';

let {
  View,
  Text
} = React;

let ContactsScreen = React.createClass({
  render: function () {
    return (
      <View style={style.container}>
        { this.props.imported ?
          this.renderContactsList() : this.renderImportPrompt() }
      </View>
    );
  },

  componentDidMount: function () {
    this.props.dispatch(importContacts({
      askPermission: false
    }));
  },

  renderImportPrompt: function () {
    let { dispatch } = this.props;

    return (
      <View style={importStyle.container}>
        <Text style={importStyle.messageText}>
          ColorChat uses your contacts to determine which of your friends are also using ColorChat.
          No information from your address book is stored on our servers.
        </Text>

        <Pressable onPress={() => dispatch(importContacts())}>
          <View style={importStyle.button}>
            <Text style={importStyle.buttonText}>Import Contacts</Text>
          </View>
        </Pressable>
      </View>
    );
  },

  renderContactsList: function () {
    return (
      <ContactListView
        contacts={this.props.data}
        onSelect={this.onSelectContact} />
    );
  },

  onSelectContact: function (contact) {
    this.props.dispatch(navigateTo('conversation', {
      data: {
        userId: contact.id,
        contactId: contact.recordID
      }
    }));
  }
});

let style = Style.create({
  container: {
    flex: 1
  }
});

let importStyle = Style.create({
  button: {
    backgroundColor: 'white',
    flex: 0,
    padding: 15,
  },
  buttonText: {
    flex: 1,
    backgroundColor: 'blue'
  }
})

let selectContacts = state => state.contacts;

export default connect(selectContacts)(ContactsScreen);
