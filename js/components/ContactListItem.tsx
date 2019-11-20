import React, {FC, useCallback} from 'react';
import {View, PixelRatio, StyleProp, ViewStyle} from 'react-native';
import Style from '../style';
import PressableView from './PressableView';
import BaseText from './BaseText';
import withStyles, {
  useStyles,
  makeStyleCreator,
  InjectedStyles,
} from '../lib/withStyles';
import {Contact, MatchedContact} from '../store/contacts/types';
import {Theme} from '../style/themes';

interface ContactListItemProps {
  contact: Contact;
  itemIndex: number;
  onPress: (contact: Contact) => void;
}

const ContactListItem: FC<ContactListItemProps> = props => {
  const {styles} = useStyles(getStyles);

  const handlePress = useCallback(() => {
    props.onPress(props.contact);
  }, [props.contact]);

  const contactStyles = [
    styles.contact,
    !props.contact.matched && styles.inactiveContact,
  ];

  const matchedContact: MatchedContact | null = props.contact.matched
    ? (props.contact as MatchedContact)
    : null;

  const avatarStyles: StyleProp<ViewStyle> = [
    styles.contactAvatar,
    matchedContact && {
      backgroundColor: matchedContact.avatar,
    },
  ];

  return (
    <PressableView
      onPress={handlePress}
      style={contactStyles}
      activeStyle={styles.contactActive}
    >
      <View style={avatarStyles} />
      <View style={styles.contactText}>
        <BaseText numberOfLines={1} style={styles.name}>
          {props.contact.givenName} {props.contact.familyName}
        </BaseText>
        <BaseText style={styles.phoneNumber} numberOfLines={1}>
          {props.contact.phoneNumber}
        </BaseText>
      </View>

      {!props.contact.matched && (
        <BaseText style={styles.inviteButton}>Invite</BaseText>
      )}
    </PressableView>
  );
};

const {rowHeight} = Style.values;

const getStyles = makeStyleCreator((theme: Theme) => ({
  contact: {
    borderBottomColor: theme.secondaryBorderColor,
    borderBottomWidth: 1 / PixelRatio.get(),
    height: Style.values.rowHeight,
    paddingHorizontal: Style.values.horizontalPadding,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactActive: {
    backgroundColor: theme.highlightColor,
  },
  inactiveContact: {
    backgroundColor: theme.contacts.inactiveBackgroundColor,
  },
  contactAvatar: {
    backgroundColor: theme.defaultAvatarColor,
    borderRadius: 200,
    width: rowHeight - 20,
    height: rowHeight - 20,
    marginRight: 15,
  },
  contactText: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'center',
  },
  inviteButton: {
    backgroundColor: theme.contacts.inviteBackgroundColor,
    color: theme.contacts.inviteTextColor,
    fontSize: 12,
    padding: 3,
    paddingHorizontal: 6,
    flex: 0,
    borderRadius: 3,
  },
  name: {
    marginTop: -1,
  },
  phoneNumber: {
    fontSize: 12,
    color: theme.secondaryTextColor,
  },
}));

const MemoizedContactListItem = React.memo(ContactListItem);

export default MemoizedContactListItem;
