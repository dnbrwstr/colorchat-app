import React, { Component } from "react";
import { View, Alert } from "react-native";
import { conversationScreenSelector } from "../lib/Selectors";
import Header from "./Header";
import { navigateBack } from "../actions/NavigationActions";
import Text from "./BaseText";
import { connectWithStyles } from "../lib/withStyles";
import RowButtonGroup from "./RowButtonGroup";
import { blockUser } from "../actions/AppActions";

class ConversationSettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.buttons = [
      {
        label: "Block User",
        action: this.handlePressBlockUser
      }
    ];
  }

  render() {
    const { styles, theme, contact } = this.props;

    const avatarStyles = [
      styles.avatar,
      { backgroundColor: this.props.contact.avatar }
    ];

    return (
      <View style={styles.container}>
        <Header
          title="Settings"
          onPressBack={() => this.props.dispatch(navigateBack())}
        />

        <View style={styles.topContainer}>
          <View style={avatarStyles} />
          <Text>{contact.name}</Text>
        </View>

        <RowButtonGroup style={styles.actionButtons} buttons={this.buttons} />
      </View>
    );
  }

  handlePressBlockUser = () => {
    Alert.alert(
      "Are you sure you want to block this user?",
      null,
      [
        { text: "Cancel", onPress: () => {} },
        { text: "Block", onPress: this.handleBlockConfirmation }
      ],
      { cancelable: false }
    );
  };

  handleBlockConfirmation = () => {
    this.props.dispatch(blockUser(this.props.contact));
  };
}

const getStyles = theme => ({
  container: {
    backgroundColor: theme.backgroundColor,
    flex: 1
  },
  topContainer: {
    alignItems: "center",
    marginVertical: 30
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150,
    marginBottom: 12
  },
  actionButtons: {}
});

export default connectWithStyles(getStyles, conversationScreenSelector)(
  ConversationSettingsScreen
);
