import React, {FC, useEffect, useCallback} from 'react';
import {View, Alert, FlatList, ListRenderItemInfo} from 'react-native';
import Text from './BaseText';
import Header from './Header';
import Style from '../style';
import {useStyles, makeStyleCreator} from '../lib/withStyles';
import {loadBlockedUsers, unblockUser} from '../store/user/actions';
import PressableView from './PressableView';
import {navigateBack} from '../store/navigation/actions';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../store/createStore';
import {Theme} from '../style/themes';
import {User} from '../store/user/types';

const getItemKey = (item: User, index: number) => {
  if (item.id) {
    return item.id.toString();
  } else {
    return index.toString();
  }
};

const useBack = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(navigateBack());
  }, []);
};

const useBlockedUsers = () => {
  return useSelector((state: AppState) => state.user.blockedUsers || []);
};

const BlockedUsersScreen: FC<{}> = () => {
  const dispatch = useDispatch();
  const blockedUsers = useBlockedUsers();
  const handlePressBack = useBack();
  const {styles} = useStyles(getStyles);

  // Load blocked users on mount
  useEffect(() => {
    dispatch(loadBlockedUsers());
  });

  return (
    <View style={styles.container}>
      <Header title="Blocked" onPressBack={handlePressBack} />
      <FlatList
        style={styles.blockedUserList}
        data={blockedUsers}
        renderItem={BlockedUserListItem}
        keyExtractor={getItemKey}
        ListEmptyComponent={BlockedUsersEmptyState}
      />
    </View>
  );
};

const BlockedUsersEmptyState: FC<{}> = () => {
  const {styles} = useStyles(getBlockedUsersEmptyStateStyles);

  return (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>No blocked users</Text>
    </View>
  );
};

const BlockedUserListItem: FC<ListRenderItemInfo<User>> = ({item}) => {
  const dispatch = useDispatch();
  const {styles} = useStyles(getBlockedUserListItemStyles);

  const handlePressUnblock = useCallback(() => {
    Alert.alert(
      'Unblock this user?',
      '',
      [
        {text: 'Cancel', onPress: () => {}},
        {text: 'Unblock', onPress: () => dispatch(unblockUser(item.id))},
      ],
      {cancelable: false},
    );
  }, [item]);

  return (
    <PressableView style={styles.user} onPress={handlePressUnblock}>
      <Text>{item.name}</Text>
      <View style={styles.unblockButton}>
        <Text style={styles.unblockButtonText}>Unblock</Text>
      </View>
    </PressableView>
  );
};

const getStyles = makeStyleCreator((theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  blockedUserList: {},
}));

const getBlockedUsersEmptyStateStyles = makeStyleCreator((theme: Theme) => ({
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  emptyStateText: {
    color: theme.secondaryTextColor,
  },
}));

const getBlockedUserListItemStyles = makeStyleCreator((theme: Theme) => ({
  user: {
    height: Style.values.rowHeight,
    padding: Style.values.outerPadding,
    borderBottomWidth: Style.values.borderWidth,
    borderBottomColor: theme.secondaryBorderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unblockButton: {
    backgroundColor: theme.primaryButtonColor,
    padding: 3,
    paddingHorizontal: 6,
    flex: 0,
    borderRadius: 3,
  },
  unblockButtonText: {
    fontSize: 12,
  },
}));

export default BlockedUsersScreen;
