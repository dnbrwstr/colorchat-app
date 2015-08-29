import { serverRoot } from '../config';
import { postJSON } from '../lib/RequestHelpers';

let errorMessages = {
  500: 'Something went wrong',
  404: 'Unable to connect to server',
  400: 'Invalid input',
  403: 'Unauthorized'
};

let sanitizeNumber = number => number.replace(/[^0-9]/g, '');

let formatPhoneNumber = (countryCode, number) =>
  `+${[countryCode, number].map(sanitizeNumber).join('')}`;

export let updateData = newData => ({
  type: 'updateData',
  data: newData
});

export let registerPhoneNumber = number => async (dispatch, getState) => {
  let state = getState();
  let { countryCode, phoneNumber } = state.signup;
  let fullNumber = formatPhoneNumber(countryCode, phoneNumber);

  try {
    dispatch({
      type: 'registerPhoneNumber',
      state: 'started',
      phoneNumber: fullNumber
    });

    let res = await postJSON(serverRoot + '/auth', {
      phoneNumber: fullNumber
    });

    if (res.ok) {
      dispatch({
        type: 'registerPhoneNumber',
        state: 'complete'
      });
    } else {
      let error = await res.text();

      dispatch({
        type: 'registerPhoneNumber',
        state: 'failed',
        error: error
      });
    }
  } catch (e) {
    dispatch({
      type: 'registerPhoneNumber',
      state: 'failed',
      error: e.toString()
    });
  }
};

export let submitConfirmationCode = (code, number) => async (dispatch, getState) => {
  try {
    let { phoneNumber, countryCode, confirmationCode } = getState().signup;
    let fullNumber = formatPhoneNumber(countryCode, phoneNumber);

    dispatch({
      type: 'submitConfirmationCode',
      state: 'started'
    });

    let res = await postJSON(serverRoot + '/auth/confirm', {
      phoneNumber: fullNumber,
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
      dispatch({
        type: 'registerPhoneNumber',
        state: 'failed',
        error: errorMessages[res.status]
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
