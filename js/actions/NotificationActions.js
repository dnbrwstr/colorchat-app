import { putAuthenticatedJSON } from '../lib/RequestHelpers';

export let triggerPermissionsDialog = () => {
  return {
    type: 'triggerPermissionsDialog'
  };
};

export let saveDeviceToken = deviceToken => async (dispatch, getState) => {
  let dispatchStateChange = (state) => ({
    type: 'saveDeviceToken',
    deviceToken: deviceToken
  });

  dispatchStateChange('started');

  let authToken = getState().user.token;
  let url = config.serverRoot + '/account';

  let res = await putAuthenticatedJSON(url, {
    deviceToken: deviceToken
  }, authToken);

  if (res.ok) {
    dispatchStateChange('complete');
  }  else {
    dispatchStateChange('failed');
  }
};
