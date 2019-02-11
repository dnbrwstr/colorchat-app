import React from "react";
import { View, Animated, PixelRatio } from "react-native";
import Style from "../style";
import PressableView from "./PressableView";
import BaseText from "./BaseText";

class ContactListItem extends React.PureComponent {
  render() {
    let contactStyles = [
      style.contact,
      !this.props.matched && style.inactiveContact
    ];

    return (
      <PressableView
        onPress={() => this.props.onPress()}
        style={contactStyles}
        activeStyle={style.contactActive}
      >
        <View style={{ flex: 1, paddingRight: 10 }}>
          <BaseText numberOfLines={1}>
            {this.props.givenName} {this.props.familyName}
          </BaseText>
        </View>
        {!this.props.matched && (
          <BaseText style={style.inviteButton}>Invite</BaseText>
        )}
      </PressableView>
    );
  }
}

let { midGray } = Style.values;

let style = Style.create({
  contact: {
    backgroundColor: "white",
    borderBottomColor: Style.values.midLightGray,
    borderBottomWidth: 1 / PixelRatio.get(),
    height: Style.values.rowHeight,
    paddingHorizontal: Style.values.horizontalPadding,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  inactiveContact: {
    backgroundColor: "rgb(250, 250, 250)"
  },
  contactActive: {
    backgroundColor: "#EFEFEF"
  },
  inviteButton: {
    backgroundColor: Style.mixins.makeGray(.72),
    color: "white",
    fontSize: 12,
    padding: 3,
    paddingHorizontal: 6,
    flex: 0,
    borderRadius: 3
  }
});

export default ContactListItem;
