import React from "react";
import { View, StyleSheet } from "react-native";
import Color from "color";
import Style from "../style";
import InteractiveView from "./InteractiveView";
import BaseText from "./BaseText";
import { shortHumanDate, formatName } from "../lib/Utils";
import { getTimestamp } from "../lib/MessageUtils";
import withStyles from "../lib/withStyles";

const DEFAULT_BG_COLOR = "#EFEFEF";

class ConversationListItem extends React.Component {
  static defaultProps = {
    onPress: () => {},
    onInteractionStart: () => {},
    onInteractionEnd: () => {},
    onDelete: () => {}
  };

  componentDidMount() {
    if (this.props.contact && !this.props.contact.avatar) {
      // Should retrieve avatar if it's missing
    }
  }

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
    const { styles } = this.props;

    let textStyles = [
      this.props.unread && {
        fontWeight: "500"
      }
    ];

    const avatarStyles = [
      styles.avatar,
      this.props.contact && {
        backgroundColor: this.props.contact.avatar || "#CCC"
      }
    ];

    const activeStyles = [styles.itemActive];

    return (
      <View style={styles.container}>
        <InteractiveView
          style={[styles.item]}
          swipeEnabled={true}
          deleteEnabled={true}
          activeStyle={activeStyles}
          onPress={this.props.onPress}
          onInteractionStart={this.props.onInteractionStart}
          onInteractionEnd={this.props.onInteractionEnd}
          onDelete={this.props.onDelete}
        >
          <View style={styles.user}>
            <View style={avatarStyles} />
            <BaseText style={textStyles}>{this.getName()}</BaseText>
          </View>
          {this.props.lastMessage && this.renderLastMessage()}
        </InteractiveView>
      </View>
    );
  }

  renderLastMessage() {
    const { lastMessage, styles } = this.props;

    const lastMessageBlockStyle = [
      styles.lastMessage,
      {
        backgroundColor: lastMessage.color
      }
    ];

    return (
      <View style={styles.lastMessageContainer}>
        <View style={lastMessageBlockStyle}>
          <BaseText style={[styles.time]} visibleOn={lastMessage.color}>
            {shortHumanDate(getTimestamp(this.props.lastMessage))}
          </BaseText>
        </View>
      </View>
    );
  }
}

const { rowHeight, avatarSize } = Style.values;

const getStyles = theme => ({
  container: {
    backgroundColor: "red"
  },
  item: {
    backgroundColor: theme.backgroundColor,
    paddingHorizontal: Style.values.horizontalPadding,
    height: rowHeight,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: theme.borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  itemActive: {
    backgroundColor: theme.highlightColor
  },
  user: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  avatar: {
    backgroundColor: "#CCC",
    borderRadius: 200,
    width: avatarSize,
    height: avatarSize,
    marginRight: 15
  },
  lastMessageContainer: {
    height: rowHeight,

    padding: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  lastMessage: {
    width: 70,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 2
  },
  time: {
    fontSize: 10,
    textAlign: "center"
  }
});

export default withStyles(getStyles)(ConversationListItem);
