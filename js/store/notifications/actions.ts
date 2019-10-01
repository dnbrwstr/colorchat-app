import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {ThunkResult} from '../createStore';
import * as Api from '../../lib/ChatApi';
import {
  NotificationAction,
  UPDATE_UNREAD_COUNT,
  TRIGGER_PERMISSIONS_DIALOG,
  CHECK_FOR_INITIAL_NOTIFICATION,
  SAVE_DEVICE_TOKEN,
  SaveDeviceTokenBaseAction,
  SaveDeviceTokenAction,
} from './types';
import {dispatchAsyncActions} from '../../lib/AsyncAction';

export const updateUnreadCount = (): NotificationAction => {
  return {
    type: UPDATE_UNREAD_COUNT,
  };
};

export let triggerPermissionsDialog = (): NotificationAction => {
  return {
    type: TRIGGER_PERMISSIONS_DIALOG,
  };
};

export const checkForInitialNotification = (): NotificationAction => {
  return {
    type: CHECK_FOR_INITIAL_NOTIFICATION,
  };
};

export const saveDeviceToken = (
  deviceToken: string,
): ThunkResult<Promise<void>> => async (dispatch, getState) => {
  const user = getState().user;
  const data = {
    deviceId: DeviceInfo.getUniqueID(),
    deviceToken: deviceToken,
    platform: Platform.OS,
  };
  const operation = Api.updateUserInfo(data, user.token);
  const baseAction = createSaveDeviceTokenBaseAction(deviceToken);
  dispatchAsyncActions<SaveDeviceTokenAction>(baseAction, operation, dispatch);
};

export const createSaveDeviceTokenBaseAction = (
  deviceToken: string,
): SaveDeviceTokenBaseAction => {
  return {
    type: SAVE_DEVICE_TOKEN,
    deviceToken,
  };
};
