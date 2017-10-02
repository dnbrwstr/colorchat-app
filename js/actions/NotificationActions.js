import { Platform } from 'react-native';
import { putAuthenticatedJSON } from '../lib/RequestHelpers';
import config from '../config';
import send from '../lib/send';

let { serverRoot } = config;

export let triggerPermissionsDialog = () => {
  return {
    type: 'triggerPermissionsDialog'
  };
};

export let saveDeviceToken = deviceToken => async (dispatch, getState) => {
  let url = serverRoot + '/account';
  let authToken = getState().user.token;

  if (authToken) {
    // Save auth token to server if we have a logged in user
    send({
      dispatch,
      actionType: 'saveDeviceToken',
      baseAction: { deviceToken },
      getRequest: () => putAuthenticatedJSON(url, {
        deviceToken: deviceToken,
        platform: Platform.OS
      }, authToken)
    });
  } else {
    // Otherwise just store it locally for now
    dispatch({
      type: 'saveDeviceToken',
      deviceToken,
      deviceTokenSaved: false
    });
  }
};
