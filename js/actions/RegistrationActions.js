export let updateData = newData => ({
  ...newData,
  type: 'updateRegistrationData'
});

export let registerPhoneNumber = number => async (dispatch, getState) => {
  let { countryCode, phoneNumber } = state.registration;
  let fullNumber = `+${countryCode}${phoneNumber}`;

  dispatch({
    type: 'registerPhoneNumber',
    state: 'started',
    number: fullNumber
  });

  try {
    await postJSON(root + '/auth', {
      number: fullNumber
    });

    dispatch({
      type: 'registerPhoneNumber',
      state: 'complete'
    });
  } catch (e) {
    dispatch({
      type: 'registerPhoneNumber',
      state: 'failed',
      error: e
    });
  }
};

export let submitConfirmationCode = (code, number) => async (dispatch, getState) => {
  dispatch({
    type: 'submitConfirmationCode',
    state: 'started'
  });

  try {
    await postJSON(root + '/auth/confirm', {
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
