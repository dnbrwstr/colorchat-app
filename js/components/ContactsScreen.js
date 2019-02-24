import React from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import ContactList from "./ContactList";
import AnimatedEllipsis from "./AnimatedEllipsis";
import { importContacts, sendInvite } from "../actions/ContactActions";
import {
  navigateToConversation,
  navigateBack,
  navigateTo
} from "../actions/NavigationActions";
import Header from "./Header";
import withStyles from "../lib/withStyles";
import ContactsImportPrompt from "./ContactsImportPrompt";

class ContactsScreen extends React.Component {
  componentDidMount() {
    this.importContacts();
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.isTransitioning &&
      prevProps.isTransitioning &&
      this.props.shouldRefresh
    ) {
      this.importContacts();
    }
  }

  importContacts = askPermission => {
    this.props.dispatch(
      importContacts({
        askPermission
      })
    );
  };

  render() {
    const { styles, theme } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title={"Contacts"}
          backgroundColor={theme.backgroundColor}
          borderColor={theme.secondaryBorderColor}
          showBack={true}
          onBack={() => this.props.dispatch(navigateBack())}
        />
        {this.renderContent()}
      </View>
    );
  }

  renderContent = () => {
    if (this.props.contacts.length) {
      return this.renderContactsList();
    } else if (this.props.importInProgress) {
      return this.renderLoader();
    } else {
      return this.renderImportPrompt();
    }
  };

  renderImportPrompt = () => {
    return (
      <ContactsImportPrompt
        onRequestInfo={this.handleShowContactsInfo}
        onPressImport={this.handleImportButtonPressed}
      />
    );
  };

  renderContactsList = () => {
    return (
      <ContactList
        contacts={this.props.contacts}
        onSelect={this.handleContactSelected}
      />
    );
  };

  renderLoader = () => {
    return (
      <View style={{ flex: 1 }}>
        <AnimatedEllipsis />
      </View>
    );
  };

  handleShowContactsInfo = () => {
    this.props.dispatch(navigateTo("contactsInfo"));
  };

  handleImportButtonPressed = () => {
    this.importContacts(true);
  };

  handleContactSelected = contact => {
    if (contact.matched) {
      this.props.dispatch(navigateToConversation(contact.id));
    } else {
      this.props.dispatch(sendInvite(contact));
    }
  };
}

const getStyle = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent"
  }
});

let selectContacts = (state, props) => {
  return {
    contacts: state.contacts,
    ...state.ui.contacts
  };
};

export default withStyles(getStyle)(connect(selectContacts)(ContactsScreen));
