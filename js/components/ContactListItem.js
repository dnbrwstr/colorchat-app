import React, { PureComponent } from "react";
import { View, Animated, PixelRatio } from "react-native";
import Style from "../style";
import PressableView from "./PressableView";
import BaseText from "./BaseText";
import withStyles from "../lib/withStyles";

class ContactListItem extends PureComponent {
  render() {
    const { styles } = this.props;

    const contactStyles = [
      styles.contact,
      !this.props.matched && styles.inactiveContact
    ];

    const avatarStyles = [
      styles.contactAvatar,
      this.props.avatar && { backgroundColor: this.props.avatar }
    ];

    return (
      <PressableView
        onPress={this.props.onPress}
        style={contactStyles}
        activeStyle={styles.contactActive}
      >
        <View style={avatarStyles} />
        <View style={{ flex: 1, paddingRight: 10, justifyContent: "center" }}>
          <BaseText numberOfLines={1} style={styles.name}>
            {this.props.givenName} {this.props.familyName}
          </BaseText>
          <BaseText style={styles.phoneNumber} numberOfLines={1}>
            {this.props.phoneNumber}
          </BaseText>
        </View>

        {!this.props.matched && (
          <BaseText style={styles.inviteButton}>Invite</BaseText>
        )}
      </PressableView>
    );
  }
}

let { rowHeight } = Style.values;

let getStyles = theme => ({
  contact: {
    borderBottomColor: theme.borderColor,
    borderBottomWidth: 1 / PixelRatio.get(),
    height: Style.values.rowHeight,
    paddingHorizontal: Style.values.horizontalPadding,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  contactActive: {
    backgroundColor: theme.highlightColor
  },
  inactiveContact: {
    backgroundColor: theme.contacts.inactiveBackgroundColor
  },
  contactAvatar: {
    backgroundColor: theme.defaultAvatarColor,
    borderRadius: 200,
    width: rowHeight - 20,
    height: rowHeight - 20,
    marginRight: 15
  },
  inviteButton: {
    backgroundColor: theme.contacts.inviteBackgroundColor,
    color: theme.contacts.inviteTextColor,
    fontSize: 12,
    padding: 3,
    paddingHorizontal: 6,
    flex: 0,
    borderRadius: 3
  },
  name: {
    marginTop: -1
  },
  phoneNumber: {
    fontSize: 12,
    color: "#AAA"
  }
});

export default withStyles(getStyles)(ContactListItem);
