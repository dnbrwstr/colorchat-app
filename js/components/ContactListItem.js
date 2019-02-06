import React from "react";
import { View, Animated, PixelRatio } from "react-native";
import Style from "../style";
import PressableView from "./PressableView";
import BaseText from "./BaseText";

class ContactListItem extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      animatedOpacity: new Animated.Value(0)
    };
  }

  componentDidMount() {
    let animation = Animated.timing(this.state.animatedOpacity, {
      toValue: 1,
      duration: 100
    });

    let runAnimation = () => animation.start();

    if (this.props.itemIndex < 12) {
      setTimeout(runAnimation, this.props.itemIndex * 50);
    } else {
      runAnimation();
    }
  }

  render() {
    let contactStyles = [
      style.contact,
      { opacity: this.state.animatedOpacity }
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
    borderTopColor: Style.values.midLightGray,
    borderTopWidth: 1 / PixelRatio.get(),
    height: Style.values.rowHeight,
    paddingHorizontal: Style.values.horizontalPadding,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  contactActive: {
    backgroundColor: "#EFEFEF"
  },
  inviteButton: {
    backgroundColor: midGray,
    color: "white",
    fontSize: 12,
    padding: 4,
    flex: 0
  }
});

export default ContactListItem;
