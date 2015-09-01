import React from 'react-native';
import Color from 'color';
import Style from '../style';
import { connect } from 'react-redux/native';
import PressableView from './PressableView';
import ContactList from './ContactList';
import { importContacts, sendInvite } from '../actions/ContactActions';
import { navigateTo } from '../actions/NavigationActions';
import BaseText from './BaseText';

let {
  View,
  Text
} = React;

let ContactsScreen = React.createClass({
  render: function () {
    return (
      <View style={style.container}>
        <View style={style.topBar}></View>
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
        <BaseText style={importStyle.messageText}>
          We need access to your contacts show you which friends are also using the app
        </BaseText>

        <PressableView
          onPress={() => dispatch(importContacts())}
          style={importStyle.button}
        >
          <BaseText style={importStyle.buttonText}>Import Contacts</BaseText>
        </PressableView>
      </View>
    );
  },

  renderContactsList: function () {
    return (
      <ContactList
        contacts={this.props.contacts}
        onSelect={this.onSelectContact} />
    );
  },

  onSelectContact: function (contact) {
    if (contact.matched) {
      this.props.dispatch(navigateTo('conversation', {
        data: { contactId: contact.id }
      }));
    } else {
      this.props.dispatch(sendInvite(contact))
    }
  }
});

let { midGray } = Style.values;

let {
  contentWrapperBase
} = Style.mixins;

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  topBar: {
    height: 20,
    backgroundColor: midGray
  }
});

let importStyle = Style.create({
  container: {
    ...contentWrapperBase,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: midGray
  },
  messageText: {
    color: 'white',
    marginBottom: 24
  },
  button: {
    backgroundColor: 'white',
    flex: 0,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
  }
})

let selectContacts = state => ({
  contacts: state.contacts,
  ...state.ui.contacts
});

export default connect(selectContacts)(ContactsScreen);
