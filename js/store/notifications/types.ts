import {AsyncAction} from '../../lib/AsyncAction';

export interface NotificationsState {
  requestPermissions: boolean;
}

export const UPDATE_UNREAD_COUNT = 'updateUnreadCount';
export const TRIGGER_PERMISSIONS_DIALOG = 'triggerPermissionsDialog';
export const CHECK_FOR_INITIAL_NOTIFICATION = 'checkForInitialNotification';
export const SAVE_DEVICE_TOKEN = 'saveDeviceToken';

export interface UpdateUnreadCountAction {
  type: typeof UPDATE_UNREAD_COUNT;
}

export interface TriggerPermissionsDialogAction {
  type: typeof TRIGGER_PERMISSIONS_DIALOG;
}

export interface CheckForInitialNotificationAction {
  type: typeof CHECK_FOR_INITIAL_NOTIFICATION;
}

export interface SaveDeviceTokenBaseAction {
  type: typeof SAVE_DEVICE_TOKEN;
  deviceToken: string;
}

export type SaveDeviceTokenAction = AsyncAction<SaveDeviceTokenBaseAction>;

export type NotificationAction =
  | UpdateUnreadCountAction
  | TriggerPermissionsDialogAction
  | CheckForInitialNotificationAction
  | SaveDeviceTokenAction;
