import React, { Component } from "react";
import Style from "../style";
import withStyles from "../lib/withStyles";

class ContactsImportPrompt extends Component {
  render() {
    const { style } = this.props;
    return (
      <View style={style.container}>
        <BaseText style={style.messageText}>
          {appName} uses your{BR}contacts to determine{BR}who you can chat with
        </BaseText>

        <SquareButton
          label="Import Contacts"
          onPress={() => this.importContacts(true)}
          style={style.button}
        />

        <PressableView
          style={style.infoLink}
          onPress={this.props.onPressImportInfo}
        >
          <BaseText style={style.infoLinkText}>
            More about how Color Chat{"\n"}uses your contacts
          </BaseText>
        </PressableView>
      </View>
    );
  }
}

const getStyles = theme => ({
  container: {
    ...Style.mixins.contentWrapperBase,
    flex: 1,
    justifyContent: "center",
    paddingTop: 100,
    backgroundColor: theme.backgroundColor
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
    backgroundColor: theme.highlightColor
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

export default withStyles(getStyles)(ContactsImportPrompt);
