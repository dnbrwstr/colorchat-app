import React, { Component } from "react";
import { View } from "react-native";
import BaseText from "./BaseText";
import SquareButton from "./SquareButton";
import PressableView from "./PressableView";
import Style from "../style";
import withStyles from "../lib/withStyles";
import config from "../config";
class ContactsImportPrompt extends Component {
  render() {
    const { styles } = this.props;
    return (
      <View style={styles.container}>
        <BaseText style={styles.messageText}>
          {config.appName} uses your{"\n"}contacts to determine{"\n"}who you can
          chat with
        </BaseText>

        <SquareButton
          label="Import Contacts"
          onPress={this.props.onPressImport}
          style={styles.button}
          textStyle={styles.buttonText}
        />

        <PressableView
          style={styles.infoLink}
          onPress={this.props.onRequestInfo}
        >
          <BaseText style={styles.infoLinkText}>
            More about how Color Chat{"\n"}uses your contacts
          </BaseText>
        </PressableView>
      </View>
    );
  }
}

const getStyles = theme => ({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.backgroundColor
  },
  messageText: {
    marginBottom: 24,
    textAlign: "center"
  },
  button: {
    backgroundColor: theme.primaryButtonColor,
    borderWidth: 0
  },
  buttonActive: {
    backgroundColor: theme.highlightColor
  },
  buttonText: {
    color: theme.primaryButtonTextColor
  },
  infoLink: {
    marginTop: 20
  },
  infoLinkText: {
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: Style.values.smallFontSize
  }
});

export default withStyles(getStyles)(ContactsImportPrompt);
