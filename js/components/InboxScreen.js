import React from "react";
import { View, Text, StatusBar } from "react-native";
import { connect } from "react-redux";
import { inboxScreenSelector } from "../lib/Selectors";
import { navigateToConversation } from "../actions/NavigationActions";
import { deleteConversation } from "../actions/ConversationActions";
import { navigateTo } from "../actions/NavigationActions";
import {
  triggerPermissionsDialog,
  updateUnreadCount
} from "../actions/NotificationActions";
import Style from "../style";
import ConversationList from "./ConversationList";
import BaseText from "./BaseText";
import PlusButton from "./PlusButton";
import Header from "./Header";
import withStyles from "../lib/withStyles";

const BR = "\n";

class InboxScreen extends React.Component {
  componentDidMount() {
    this.props.dispatch(triggerPermissionsDialog());
    this.props.dispatch(updateUnreadCount());
  }

  render() {
    const { theme, styles } = this.props;

    return (
      <View style={styles.container}>
        <Header
          title={"Color Chat"}
          highlightColor={theme.highlightColor}
          borderColor={theme.secondaryBorderColor}
          showSettingsButton={true}
        />
        {this.props.conversations.length
          ? this.renderConversations()
          : this.renderEmptyMessage()}
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
    const { styles } = this.props;
    return (
      <View style={styles.emptyMessageWrapper}>
        <BaseText style={styles.emptyMessage}>
          Use the plus button in the{BR}lower right to start a conversation
        </BaseText>
      </View>
    );
  };

  handleAddButtonPressed = () => {
    this.props.dispatch(navigateTo("contacts"));
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
  }
}));

export default addStyle(connect(inboxScreenSelector)(InboxScreen));
