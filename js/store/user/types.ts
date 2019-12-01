import {AsyncAction} from '../../lib/AsyncAction';
import {ApiBlockedUsersResponse, ApiAccount} from 'js/lib/ChatApi';

export interface User {
  id: number;
  token: string;
  phoneNumber: string;
  name?: string;
  avatar?: string;
  deviceToken?: string;
  deviceTokenSaved?: boolean;
  blockedUsers?: ApiUser[];
  unreadCount?: number;
}

export interface ApiUser {
  id: number;
  avatar: string;
  name: string;
}

export type UserState = User | null;

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

export type LoadUserInfoAction = AsyncAction<
  LoadUserInfoBaseAction,
  ApiAccount
>;

export interface UpdateUserInfoBaseAction {
  type: typeof UPDATE_USER_INFO;
  data: Partial<User>;
}

export type UpdateUserInfoAction = AsyncAction<
  UpdateUserInfoBaseAction,
  Partial<User>
>;

export interface BlockUserBaseAction {
  type: typeof BLOCK_USER;
  userId: number;
}

export type BlockUserAction = AsyncAction<
  BlockUserBaseAction,
  ApiBlockedUsersResponse
>;

export interface UnblockUserBaseAction {
  type: typeof UNBLOCK_USER;
  userId: number;
}

export type UnblockUserAction = AsyncAction<
  UnblockUserBaseAction,
  ApiBlockedUsersResponse
>;

export interface LoadBlockedUsersBaseAction {
  type: typeof LOAD_BLOCKED_USERS;
}

export type LoadBlockedUsersAction = AsyncAction<
  LoadBlockedUsersBaseAction,
  ApiBlockedUsersResponse
>;

export interface LogoutAction {
  type: typeof LOGOUT;
}

export interface DeleteAccountBaseAction {
  type: typeof DELETE_ACCOUNT;
}

export type DeleteAccountAction = AsyncAction<DeleteAccountBaseAction>;
