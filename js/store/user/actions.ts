import {Alert} from 'react-native';
import {dispatchAsyncActions} from '../../lib/AsyncAction';
import {ThunkResult} from '../createStore';
import {purgeMessages} from '../../lib/DatabaseUtils';
import {
  User,
  LoadUserInfoBaseAction,
  LoadUserInfoAction,
  LOAD_USER_INFO,
  BLOCK_USER,
  BlockUserAction,
  BlockUserBaseAction,
  UnblockUserBaseAction,
  UNBLOCK_USER,
  UnblockUserAction,
  LOAD_BLOCKED_USERS,
  LoadBlockedUsersBaseAction,
  LoadBlockedUsersAction,
  UPDATE_USER_INFO,
  UpdateUserInfoAction,
  UpdateUserInfoBaseAction,
  LOGOUT,
  LogoutAction,
  DELETE_ACCOUNT,
  DeleteAccountBaseAction,
  DeleteAccountAction,
  ApiUser,
} from './types';
import * as Api from '../../lib/ChatApi';

export const loadUserInfo = (): ThunkResult<Promise<void>> => async (
  dispatch,
  getState,
) => {
  const user = getState().user;
  if (!user) return;
  const operation = Api.getUserInfo(user.token);
  const baseAction = createLoadUserInfoBaseAction(user);
  dispatchAsyncActions<LoadUserInfoAction>(baseAction, operation, dispatch);
};

export const createLoadUserInfoBaseAction = (
  user: User,
): LoadUserInfoBaseAction => {
  return {
    type: LOAD_USER_INFO,
    user,
  };
};

export let updateUserInfo = (
  data: Partial<User>,
): ThunkResult<Promise<void>> => async (dispatch, getState) => {
  const user = getState().user;
  if (!user) return;
  const operation = Api.updateUserInfo(data, user.token);
  const baseAction = createUpdateUserInfoBaseAction(data);
  dispatchAsyncActions<UpdateUserInfoAction>(baseAction, operation, dispatch);
};

export const createUpdateUserInfoBaseAction = (
  data: Partial<User>,
): UpdateUserInfoBaseAction => {
  return {
    type: UPDATE_USER_INFO,
    data: data,
  };
};

export const blockUser = (blockedUserId: number): ThunkResult<void> => (
  dispatch,
  getState,
) => {
  const user = getState().user;
  if (!user) return;
  const operation = Api.blockUser(blockedUserId, user.token);
  const baseAction = createBlockUserBaseAction(blockedUserId);
  dispatchAsyncActions<BlockUserAction>(baseAction, operation, dispatch);
};

export const createBlockUserBaseAction = (
  userId: number,
): BlockUserBaseAction => {
  return {
    type: BLOCK_USER,
    userId,
  };
};

export const unblockUser = (userId: number): ThunkResult<void> => (
  dispatch,
  getState,
) => {
  const user = getState().user;
  if (!user) return;
  const operation = Api.unblockUser(userId, user.token);
  const baseAction = createUnblockUserBaseAction(userId);
  dispatchAsyncActions<UnblockUserAction>(baseAction, operation, dispatch);
};

export const createUnblockUserBaseAction = (
  userId: number,
): UnblockUserBaseAction => {
  return {
    type: UNBLOCK_USER,
    userId: userId,
  };
};

export const loadBlockedUsers = (): ThunkResult<void> => (
  dispatch,
  getState,
) => {
  const user = getState().user;
  if (!user) return;
  const operation = Api.loadBlockedUsers(user.token);
  const baseAction = createLoadBlockedUsersBaseAction();
  dispatchAsyncActions<LoadBlockedUsersAction>(baseAction, operation, dispatch);
};

export const createLoadBlockedUsersBaseAction = (): LoadBlockedUsersBaseAction => {
  return {
    type: LOAD_BLOCKED_USERS,
  };
};

export const logout = (): LogoutAction => ({type: LOGOUT});

export const deleteAccount = (): ThunkResult<Promise<void>> => async (
  dispatch,
  getState,
) => {
  const user = getState().user;
  if (!user) return;
  const operation = runDeleteAccount(user.token);
  const baseAction = createDeleteAccountBaseAction();
  dispatchAsyncActions<DeleteAccountAction>(baseAction, operation, dispatch);
};

export const createDeleteAccountBaseAction = (): DeleteAccountBaseAction => {
  return {
    type: DELETE_ACCOUNT,
  };
};

export const runDeleteAccount = async (authToken?: string) => {
  await Api.deleteAccount(authToken);
  Alert.alert('Your account has been deleted! Enjoy your day :)');
  await purgeMessages();
};
