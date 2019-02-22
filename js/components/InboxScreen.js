import React from "react";
import { View, Text, StatusBar } from "react-native";
import { connect } from "react-redux";
import memoize from "memoize-one";
import { inboxScreenSelector } from "../lib/Selectors";
import { navigateToConversation } from "../actions/NavigationActions";
import { deleteConversation } from "../actions/ConversationActions";
import { navigateTo } from "../actions/NavigationActions";
import { triggerPermissionsDialog } from "../actions/NotificationActions";
import Style from "../style";
import ConversationList from "./ConversationList";
import BaseText from "./BaseText";
import PlusButton from "./PlusButton";
import SettingsButton from "./SettingsButton";
import Header from "./Header";
import withStyles from "../lib/withStyles";
import { getStatusBarHeight } from "react-native-iphone-x-helper";

const BR = "\n";

class InboxScreen extends React.Component {
  componentDidMount() {
    this.props.dispatch(triggerPermissionsDialog());
  }

  render() {
    const { theme, styles } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title={"Color Chat"}
          highlightColor={theme.highlightColor}
          borderColor={theme.borderColor}
        />
        {this.props.conversations.length
          ? this.renderConversations()
          : this.renderEmptyMessage()}
        <SettingsButton
          style={styles.settingsButton}
          onPress={this.handleSettingsButtonPressed}
        />
        <PlusButton
          style={styles.contactsButton}
          onPress={this.handleAddButtonPressed}
        />
      </View>
    );
  }

  renderConversations = () => {
    let conversations = this.props.conversations.map(c => ({
      ...c,
      contact: this.props.contacts[c.recipientId]
    }));

    return (
      <ConversationList
        conversations={conversations}
        onSelect={this.handleConversationSelected}
        onDelete={this.handleConversationDeleted}
      />
    );
  };

  renderEmptyMessage = () => {
    return (
      <View style={style.emptyMessageWrapper}>
        <BaseText style={style.emptyMessage}>
          Use the plus button in the{BR}lower right to start a conversation
        </BaseText>
      </View>
    );
  };

  handleAddButtonPressed = () => {
    this.props.dispatch(navigateTo("contacts"));
  };

  handleSettingsButtonPressed = () => {
    this.props.dispatch(navigateTo("settings"));
  };

  handleConversationSelected = conversation => {
    this.props.dispatch(navigateToConversation(conversation.recipientId));
  };

  handleConversationDeleted = conversation => {
    this.props.dispatch(deleteConversation(conversation));
  };
}

let { contentWrapperBase } = Style.mixins;

const addStyle = withStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  emptyMessageWrapper: {
    ...contentWrapperBase,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyMessage: {
    textAlign: "center"
  },
  contactsButton: {
    backgroundColor: theme.inbox.contactsButtonBackgroundColor,
    padding: 12,
    marginTop: 18,
    flex: 0
  },
  contactsButtonText: {
    color: "white",
    textAlign: "center",
    flex: 0
  },
  settingsButton: {
    backgroundColor: theme.inbox.settingsButtonBackgroundColor,
    bottom: 78
  }
}));

export default addStyle(connect(inboxScreenSelector)(InboxScreen));
