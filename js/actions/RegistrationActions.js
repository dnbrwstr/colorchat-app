import { serverRoot } from '../config';

let postJSON = (url, data) => fetch(url, {
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

export let updateData = newData => ({
  type: 'updateData',
  data: newData
});

export let registerPhoneNumber = number => async (dispatch, getState) => {
  let state = getState();
  let { countryCode, phoneNumber } = state.registration;
  let fullNumber = `+${countryCode}${phoneNumber}`;

  try {
    dispatch({
      type: 'registerPhoneNumber',
      state: 'started',
      number: fullNumber
    });

    let res = await postJSON(serverRoot + '/auth', {
      number: fullNumber
    });

    let errorMessages = {
      500: 'Something went wrong',
      404: 'Unable to connect to server',
      400: 'Invalid input',
      403: 'Unauthorized'
    }

    if (res.ok) {
      dispatch({
        type: 'registerPhoneNumber',
        state: 'complete'
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
      type: 'registerPhoneNumber',
      state: 'failed',
      error: e.toString()
    });
  }
};

export let submitConfirmationCode = (code, number) => async (dispatch, getState) => {
  dispatch({
    type: 'submitConfirmationCode',
    state: 'started'
  });

  try {
    await postJSON(serverRoot + '/auth/confirm', {
      number: number,
      code: code
    });

    dispatch({
      type: 'submitConfirmationCode',
      state: 'complete'
    });
  } catch (e) {
    dispatch({
      type: 'submitConfirmationCode',
      state: 'failed',
      error: e
    });
  }
};

export let clearRegistrationError = () => ({
  type: 'clearRegistrationError'
});
