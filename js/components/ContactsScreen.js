import React from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import Color from "color";
import Style from "../style";
import PressableView from "./PressableView";
import ContactList from "./ContactList";
import AnimatedEllipsis from "./AnimatedEllipsis";
import { importContacts, sendInvite } from "../actions/ContactActions";
import {
  navigateToConversation,
  navigateBack,
  navigateTo
} from "../actions/NavigationActions";
import config from "../config";
import BaseText from "./BaseText";
import Header from "./Header";
import SquareButton from "./SquareButton";

let { appName } = config;

const BR = "\n";

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

  handleShowContactsInfo = () => {
    this.props.dispatch(navigateTo("contactsInfo"));
  };

  render() {
    return (
      <View style={style.container}>
        {this.renderContent()}

        <View style={style.headerWrapper}>
          <Header
            title={"Contacts"}
            backgroundColor={"rgba(255,255,255,1)"}
            highlightColor={Style.values.veryLightGray}
            showBack={true}
            onBack={() => this.props.dispatch(navigateBack())}
            borderColor={Style.values.midLightGray}
          />
        </View>
      </View>
    );
  }

  renderContent = () => {
    if (this.props.contacts.length) {
      return this.renderContactsList();
    } else if (this.props.importError) {
      return this.renderImportPrompt();
    } else {
      return this.renderLoader();
    }
  };

  renderImportPrompt = () => {
    let { dispatch } = this.props;

    return (
      <View style={importStyle.container}>
        <BaseText style={importStyle.messageText}>
          {appName} uses your{BR}contacts to determine{BR}who you can chat with
        </BaseText>

        <SquareButton
          label="Import Contacts"
          onPress={() => this.importContacts(true)}
          style={importStyle.button}
        />

        <PressableView
          style={importStyle.infoLink}
          onPress={this.handleShowContactsInfo}
        >
          <BaseText style={importStyle.infoLinkText}>
            More about how Color Chat{"\n"}uses your contacts
          </BaseText>
        </PressableView>
      </View>
    );
  };

  renderContactsList = () => {
    return (
      <ContactList
        contacts={this.props.contacts}
        onSelect={this.onSelectContact}
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

  importContacts = askPermission => {
    this.props.dispatch(
      importContacts({
        askPermission
      })
    );
  };

  onSelectContact = contact => {
    if (contact.matched) {
      this.props.dispatch(navigateToConversation(contact.id));
    } else {
      this.props.dispatch(sendInvite(contact));
    }
  };
}

let { midGray } = Style.values;

let { contentWrapperBase } = Style.mixins;

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: Style.values.backgroundGray
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent"
  }
});

let importStyle = Style.create({
  container: {
    ...contentWrapperBase,
    flex: 1,
    justifyContent: "center",
    backgroundColor: Style.values.backgroundGray,
    paddingTop: 100
  },
  messageText: {
    marginBottom: 24,
    textAlign: "center"
  },
  button: {
    backgroundColor: "white",
    borderWidth: 0
  },
  buttonActive: {
    backgroundColor: Style.values.veryLightGray
  },
  buttonText: {},
  infoLink: {
    marginTop: 20
  },
  infoLinkText: {
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: Style.values.smallFontSize
  }
});

let selectContacts = (state, props) => {
  return {
    contacts: state.contacts,
    ...state.ui.contacts
  };
};

export default connect(selectContacts)(ContactsScreen);
