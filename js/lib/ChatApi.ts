import send from './send';
import {
  getAuthenticated,
  postAuthenticated,
  deleteAuthenticated,
  putAuthenticatedJSON,
  postJSON,
} from './RequestHelpers';
import config from '../config';
import {PlatformOSType} from 'react-native';

const endpoints = {
  authenticate: 'auth',
  confirmNumber: 'auth/confirm',
  account: 'account',
  blockedUsers: 'account/blocked',
};

export interface ApiAccount {
  id: number;
  name: string;
  avatar: string;
  phoneNumber: string;
}

export interface ApiUser {
  id: number;
  name: string;
  avatar: string;
}

export interface ApiDeviceToken {
  deviceId: string;
  deviceToken: string;
  platform: PlatformOSType;
}

export interface ApiBlockedUsersResponse {
  blockedUsers: ApiUser[];
}

export interface ApiRegisterResponse {
  phoneNumber: string;
}

export interface ApiConfirmNumberResponse {
  user: {
    id: number;
    token: string;
    phoneNumber: string;
  };
}

const ensureToken = (authToken?: string): string => {
  if (!authToken) {
    throw new Error('Missing user token');
  } else {
    return authToken;
  }
};

const ensureId = (userId?: number) => {
  if (!userId) {
    throw new Error('Missing user id');
  } else {
    return userId;
  }
};

export const registerPhoneNumber = async (
  countryCode: string,
  baseNumber: string,
): Promise<ApiRegisterResponse> => {
  const url = config.serverRoot + '/' + endpoints.authenticate;
  console.log('REgistrong', url, {baseNumber, countryCode});
  const getRequest = () => postJSON(url, {baseNumber, countryCode});
  return send<ApiRegisterResponse>(getRequest);
};

export const submitConfirmationCode = async (
  phoneNumber: string,
  code: string,
): Promise<ApiConfirmNumberResponse> => {
  const url = config.serverRoot + '/' + endpoints.confirmNumber;
  const getRequest = () => postJSON(url, {phoneNumber, code});
  return send<ApiConfirmNumberResponse>(getRequest);
};

export const getUserInfo = async (authToken?: string): Promise<ApiAccount> => {
  const token = ensureToken(authToken);
  const url = config.serverRoot + '/' + endpoints.account;
  return send<ApiAccount>(() => getAuthenticated(url, token));
};

export const updateUserInfo = (
  data: Partial<ApiUser> | ApiDeviceToken,
  authToken?: string,
): Promise<ApiAccount> => {
  const token = ensureToken(authToken);
  const url = config.serverRoot + '/' + endpoints.account;
  const getRequest = () => putAuthenticatedJSON(url, data, token);
  return send<ApiAccount>(getRequest);
};

const getBlockUrl = (userId: number) =>
  [config.serverRoot, endpoints.blockedUsers, userId].join('/');

export const blockUser = (
  userId?: number,
  authToken?: string,
): Promise<ApiBlockedUsersResponse> => {
  const token = ensureToken(authToken);
  const id = ensureId(userId);
  const url = getBlockUrl(id);
  const getRequest = () => postAuthenticated(url, token);
  return send<ApiBlockedUsersResponse>(getRequest);
};

export const unblockUser = (
  userId?: number,
  authToken?: string,
): Promise<ApiBlockedUsersResponse> => {
  const token = ensureToken(authToken);
  const id = ensureId(userId);
  const url = getBlockUrl(id);
  const getRequest = () => deleteAuthenticated(url, token);
  return send<ApiBlockedUsersResponse>(getRequest);
};

export const loadBlockedUsers = (
  authToken?: string,
): Promise<ApiBlockedUsersResponse> => {
  const token = ensureToken(authToken);
  const url = config.serverRoot + '/' + endpoints.blockedUsers;
  console.log('loading blocked users from', url);
  const getRequest = () => getAuthenticated(url, token);
  return send<ApiBlockedUsersResponse>(getRequest);
};

export const deleteAccount = (authToken?: string): Promise<void> => {
  const token = ensureToken(authToken);
  const url = config.serverRoot + '/' + endpoints.account;
  const getRequest = () => deleteAuthenticated(url, token);
  return send(getRequest);
};
