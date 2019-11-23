import {AsyncAction} from '../../lib/AsyncAction';
export type User = {
  id?: number;
  name?: string;
  phoneNumber?: string;
  avatar?: string;
  token?: string;
  deviceToken?: string;
  deviceTokenSaved?: boolean;
  blockedUsers?: User[];
  unreadCount?: number;
};

export type UserState = User;

export const LOAD_USER_INFO = 'loadUserInfo';
export const UPDATE_USER_INFO = 'updateUserInfo';
export const BLOCK_USER = 'blockUser';
export const UNBLOCK_USER = 'unblockUser';
export const LOAD_BLOCKED_USERS = 'loadBlockedUsers';
export const LOGOUT = 'logout';
export const DELETE_ACCOUNT = 'deleteAccount';

export interface LoadUserInfoBaseAction {
  type: typeof LOAD_USER_INFO;
  user: User;
}

export type LoadUserInfoAction = AsyncAction<LoadUserInfoBaseAction, User>;

export interface UpdateUserInfoBaseAction {
  type: typeof UPDATE_USER_INFO;
  data: Partial<User>;
}

export type UpdateUserInfoAction = AsyncAction<UpdateUserInfoBaseAction, User>;

export interface BlockUserBaseAction {
  type: typeof BLOCK_USER;
  userId: number;
}

export type BlockUserAction = AsyncAction<BlockUserBaseAction, User>;

export interface UnblockUserBaseAction {
  type: typeof UNBLOCK_USER;
  userId: number;
}

export type UnblockUserAction = AsyncAction<UnblockUserBaseAction, User>;

export interface LoadBlockedUsersBaseAction {
  type: typeof LOAD_BLOCKED_USERS;
}

export type LoadBlockedUsersAction = AsyncAction<
  LoadBlockedUsersBaseAction,
  User
>;

export interface LogoutAction {
  type: typeof LOGOUT;
}

export interface DeleteAccountBaseAction {
  type: typeof DELETE_ACCOUNT;
}

export type DeleteAccountAction = AsyncAction<DeleteAccountBaseAction>;
