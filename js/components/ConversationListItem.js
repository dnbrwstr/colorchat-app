import React from "react";
import { Animated } from "react-native";
import Color from "color";
import Style from "../style";
import InteractiveView from "./InteractiveView";
import BaseText from "./BaseText";
import { shortHumanDate, formatName } from "../lib/Utils";
import { getTimestamp } from "../lib/MessageUtils";

const DEFAULT_BG_COLOR = "#EFEFEF";

class ConversationListItem extends React.Component {
  static defaultProps = {
    onPress: () => {},
    onInteractionStart: () => {},
    onInteractionEnd: () => {},
    onDelete: () => {}
  };

  getActiveBackgroundColor = () => {
    let color = this.getColor();
    let isLight = Color(color).luminosity() > 0.5;
    let colorFn = isLight ? "darken" : "lighten";
    return Color(color)
      [colorFn](0.2)
      .hexString();
  };

  getColor = () => {
    if (this.props.lastMessage && this.props.lastMessage.color) {
      return this.props.lastMessage.color;
    } else {
      return DEFAULT_BG_COLOR;
    }
  };

  getName = () => {
    if (this.props.contact) {
      let { givenName, familyName } = this.props.contact;
      return formatName(givenName, familyName);
    } else if (this.props.recipientName) {
      return this.props.recipientName;
    } else {
      return "Unknown";
    }
  };

  render() {
    let { contact, lastMessage } = this.props;

    let conversationStyles = [{ backgroundColor: this.getColor() }, style.item];

    let conversationActiveStyle = {
      backgroundColor: this.getActiveBackgroundColor()
    };

    let textStyles = [
      this.props.unread && {
        fontWeight: "500"
      }
    ];

    return (
      <InteractiveView
        style={conversationStyles}
        swipeEnabled={true}
        deleteEnabled={true}
        activeStyle={conversationActiveStyle}
        onPress={this.props.onPress}
        onInteractionStart={this.props.onInteractionStart}
        onInteractionEnd={this.props.onInteractionEnd}
        onDelete={this.props.onDelete}
      >
        <BaseText visibleOn={this.getColor()} style={textStyles}>
          {this.getName()}
        </BaseText>
        {this.props.lastMessage && (
          <BaseText visibleOn={this.getColor()} style={textStyles}>
            {shortHumanDate(getTimestamp(this.props.lastMessage))}
          </BaseText>
        )}
      </InteractiveView>
    );
  }
}

export default ConversationListItem;

let style = Style.create({
  item: {
    paddingHorizontal: Style.values.horizontalPadding,
    height: Style.values.rowHeight,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  }
});
