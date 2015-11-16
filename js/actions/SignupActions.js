import { merge } from 'ramda';
import { serverRoot } from '../config';
import { postJSON, putAuthenticatedJSON } from '../lib/RequestHelpers';
import send from '../lib/send';

let sanitizeNumber = number => number.replace(/[^0-9]/g, '');

let formatPhoneNumber = (countryCode, baseNumber) =>
  `+${[countryCode, baseNumber].map(sanitizeNumber).join('')}`;

export let updateData = newData => ({
  type: 'updateData',
  data: newData
});

export let registerPhoneNumber = () => async (dispatch, getState) => {
  let state = getState();
  let { countryCode, baseNumber } = state.signup;
  let phoneNumber = formatPhoneNumber(countryCode, baseNumber);

  console.log('sending');

  send({
    dispatch,
    actionType: 'registerPhoneNumber',
    getRequest: () => postJSON(serverRoot + '/auth', {
      baseNumber: baseNumber,
      countryCode: countryCode
    })
  });
};

export let submitConfirmationCode = () => async (dispatch, getState) => {
  let {
    baseNumber,
    countryCode,
    confirmationCode
  } = getState().signup;

  let phoneNumber = formatPhoneNumber(countryCode, baseNumber);

  send({
    dispatch,
    actionType: 'submitConfirmationCode',
    getRequest: () => postJSON(serverRoot + '/auth/confirm', {
      phoneNumber: phoneNumber,
      code: confirmationCode
    })
  });
};

export let saveName = name => async (dispatch, getState) => {
  let authToken = getState().user.token;
  let url = serverRoot + '/account';

  send({
    dispatch,
    actionType: 'submitNotificationName',
    getRequest: () => putAuthenticatedJSON(url, { name }, authToken)
  });
};

export let clearSignupError = () => ({
  type: 'clearSignupError'
});

export let clearConfirmCodeError = () => ({
  type: 'clearSignupError'
});
