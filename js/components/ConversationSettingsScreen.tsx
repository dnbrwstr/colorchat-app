import React, {Component, FC, useCallback, useMemo} from 'react';
import {View, Alert} from 'react-native';
import {conversationScreenSelector} from '../store/Selectors';
import Header from './Header';
import {navigateBack} from '../store/navigation/actions';
import Text from './BaseText';
import {useStyles, makeStyleCreator} from '../lib/withStyles';
import RowButtonGroup from './RowButtonGroup';
import {blockUser} from '../store/user/actions';
import {useDispatch, useSelector} from 'react-redux';
import {Contact, MatchedContact} from '../store/contacts/types';
import {Theme} from '../style/themes';
import {getContactAvatar, getContactName} from '../lib/ContactUtils';

interface ConversationSettingsScreenProps {}

const ConversationSettingsScreen: FC<ConversationSettingsScreenProps> = props => {
  const dispatch = useDispatch();
  const {styles, theme} = useStyles(getStyles);
  const {contact, recipientId, recipientName} = useSelector(
    conversationScreenSelector,
  );

  const handlePressBlockUser = useCallback(() => {
    Alert.alert(
      'Are you sure you want to block this user?',
      '',
      [
        {text: 'Cancel', onPress: () => {}},
        {text: 'Block', onPress: () => dispatch(blockUser(recipientId))},
      ],
      {cancelable: false},
    );
  }, [recipientId]);

  const buttons = useMemo(
    () => [
      {
        label: 'Block User',
        action: handlePressBlockUser,
      },
    ],
    [],
  );

  const avatarStyles = [
    styles.avatar,
    {backgroundColor: getContactAvatar(contact, theme)},
  ];

  return (
    <View style={styles.container}>
      <Header title="Settings" onPressBack={() => dispatch(navigateBack())} />

      <View style={styles.topContainer}>
        <View style={avatarStyles} />
        <Text>{getContactName(contact, recipientName)}</Text>
      </View>

      <RowButtonGroup style={styles.actionButtons} buttons={buttons} />
    </View>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    backgroundColor: theme.backgroundColor,
    flex: 1,
  },
  topContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150,
    marginBottom: 15,
  },
  actionButtons: {},
}));

export default ConversationSettingsScreen;
