import React, {Component} from 'react';
import {View, StyleProp, TextStyle, ViewStyle} from 'react-native';
import Color from 'color';
import Style from '../style';
import BaseText from './BaseText';
import {shortHumanDate, formatName} from '../lib/Utils';
import {getTimestamp} from '../lib/MessageUtils';
import withStyles, {makeStyleCreator, InjectedStyles} from '../lib/withStyles';
import {Theme} from '../style/themes';
import {Conversation} from '../store/conversations/types';
import {MatchedContact, Contact} from '../store/contacts/types';
import {getContactName, getContactAvatar} from '../lib/ContactUtils';
import {RectButton} from 'react-native-gesture-handler';
import SwipeableDelete from './SwipeableDelete';

const DEFAULT_BG_COLOR = '#EFEFEF';

interface ConversationListItemProps extends Conversation {
  contact: Contact;
  onPress: () => void;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
  onDelete: () => void;
  styles: InjectedStyles<typeof getStyles>;
  theme: Theme;
}

class ConversationListItem extends Component<ConversationListItemProps> {
  static defaultProps = {
    onPress: () => {},
    onInteractionStart: () => {},
    onInteractionEnd: () => {},
    onDelete: () => {},
  };

  componentDidMount() {
    if (this.props.contact && !(this.props.contact as MatchedContact).avatar) {
      // Should retrieve avatar if it's missing
    }
  }

  getActiveBackgroundColor = () => {
    let color = this.getColor();
    let isLight = Color(color).luminosity() > 0.5;
    let colorFn: 'darken' | 'lighten' = isLight ? 'darken' : 'lighten';
    return Color(color)
      [colorFn](0.2)
      .hex();
  };

  getColor = () => {
    if (this.props.lastMessage && this.props.lastMessage.color) {
      return this.props.lastMessage.color;
    } else {
      return DEFAULT_BG_COLOR;
    }
  };

  render() {
    const {styles, theme, recipientAvatar} = this.props;

    let textStyles: StyleProp<TextStyle> = [
      this.props.unread && {
        fontWeight: '500',
      },
    ];

    const avatarColor = getContactAvatar(
      this.props.contact,
      recipientAvatar,
      theme,
    );

    const avatarStyles = ([
      styles.avatar,
      {
        backgroundColor: avatarColor,
      },
    ] as any) as StyleProp<ViewStyle>;

    return (
      <SwipeableDelete onPressDelete={this.props.onDelete}>
        <RectButton
          style={[styles.item]}
          onPress={this.props.onPress}
          activeOpacity={0}
        >
          <View style={styles.user}>
            <View style={avatarStyles} />
            <BaseText style={textStyles}>{this.props.recipientName}</BaseText>
          </View>
          {this.props.lastMessage && this.renderLastMessage()}
        </RectButton>
      </SwipeableDelete>
    );
  }

  renderLastMessage() {
    const {lastMessage, styles} = this.props;
    if (!lastMessage) return;

    const lastMessageBlockStyle = [
      styles.lastMessage,
      {
        backgroundColor: lastMessage.color,
      },
    ];

    return (
      <View style={styles.lastMessageContainer}>
        <View style={lastMessageBlockStyle}>
          <BaseText style={[styles.time]} visibleOn={lastMessage.color}>
            {shortHumanDate(getTimestamp(lastMessage))}
          </BaseText>
        </View>
      </View>
    );
  }
}

const {rowHeight, avatarSize} = Style.values;

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: theme.backgroundColor,
    paddingHorizontal: Style.values.horizontalPadding,
    height: rowHeight,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  user: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.defaultAvatarColor,
    borderRadius: 200,
    width: avatarSize,
    height: avatarSize,
    marginRight: 15,
  },
  lastMessageContainer: {
    height: rowHeight,

    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastMessage: {
    width: 70,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  time: {
    fontSize: 10,
    textAlign: 'center',
  },
}));

export default withStyles(getStyles)(ConversationListItem);
