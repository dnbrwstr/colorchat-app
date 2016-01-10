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

  send({
    dispatch,
    actionType: 'saveDeviceToken',
    baseAction: { deviceToken },
    getRequest: () => putAuthenticatedJSON(url, {
      deviceToken: deviceToken
    }, authToken)
  });
};
