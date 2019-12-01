import createRoutingReducer, {CaseHandlerMap} from '../createRoutingReducer';
import {
  TRIGGER_PERMISSIONS_DIALOG,
  SAVE_DEVICE_TOKEN,
  NotificationsState,
  TriggerPermissionsDialogAction,
  SaveDeviceTokenAction,
} from './types';

const initialState: NotificationsState = {
  requestPermissions: false,
};

const handlers: CaseHandlerMap<NotificationsState> = {
  [TRIGGER_PERMISSIONS_DIALOG]: function(
    state,
    action: TriggerPermissionsDialogAction,
  ) {
    return {
      ...state,
      requestPermissions: true,
    };
  },

  [SAVE_DEVICE_TOKEN]: function(state, action: SaveDeviceTokenAction) {
    return {
      ...state,
      requestPermissions: false,
    };
  },
};

export default createRoutingReducer({
  handlers,
  initialState,
});
