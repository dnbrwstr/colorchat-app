import { merge } from 'ramda';
import { serverRoot } from '../config';
import { postJSON } from '../lib/RequestHelpers';

let baseErrorMessages = {
  500: 'Something went wrong',
  404: 'Unable to connect to server',
  400: 'Invalid input',
  403: 'Unauthorized'
};

let registrationErrorMessages = merge(baseErrorMessages, {

});

let confirmationCodeErrorMessages = merge(baseErrorMessages, {
  400: 'Please enter your confirmation code',
  403: 'Not a valid confirmation code'
});

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

  try {
    dispatch({
      type: 'registerPhoneNumber',
      state: 'started',
      phoneNumber: phoneNumber
    });

    let res = await postJSON(serverRoot + '/auth', {
      baseNumber: baseNumber,
      countryCode: countryCode
    });

    if (res.ok) {
      dispatch({
        type: 'registerPhoneNumber',
        state: 'complete'
      });
    } else {
      let error = registrationErrorMessages[res.status];
      dispatch({
        type: 'registerPhoneNumber',
        state: 'failed',
        error: error
      });
    }
  } catch (err) {
    dispatch({
      type: 'registerPhoneNumber',
      state: 'failed',
      error: err.message
    });
  }
};

export let submitConfirmationCode = () => async (dispatch, getState) => {
  try {
    let { baseNumber, countryCode, confirmationCode } = getState().signup;
    let phoneNumber = formatPhoneNumber(countryCode, baseNumber);

    dispatch({
      type: 'submitConfirmationCode',
      state: 'started'
    });

    let res = await postJSON(serverRoot + '/auth/confirm', {
      phoneNumber: phoneNumber,
      code: confirmationCode
    });

    if (res.ok) {
      let json = await res.json();

      dispatch({
        type: 'submitConfirmationCode',
        state: 'complete',
        data: json
      });
    } else {
      let error = confirmationCodeErrorMessages[res.status];
      dispatch({
        type: 'submitConfirmationCode',
        state: 'failed',
        error: error
      });
    }
  } catch (e) {
    dispatch({
      type: 'submitConfirmationCode',
      state: 'failed',
      error: e
    });
  }
};

export let clearSignupError = () => ({
  type: 'clearSignupError'
});

export let clearConfirmCodeError = () => ({
  type: 'clearSignupError'
});
