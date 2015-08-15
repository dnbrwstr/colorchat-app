import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = {
  country: 'United States',
  countryCode: '1',
  phoneNumber: '',
  phoneNumberError: '',
  confirmationCode: '',
  confirmCodeError: '',
  loading: false
};

let handleRegistrationRequest = (state, action) => {
  console.log('redcing', state, action)
  if (action.state === 'started') {
    return {
      ...state,
      loading: true
    }
  } else if (action.state == 'complete') {
    return {
      ...state,
      loading: false
    }
  } else if (action.state == 'failed') {
    return {
      ...state,
      loading: false,
      error: action.error
    }
  }
}

let handlers = {
  registerPhoneNumber: (state, action) => handleRegistrationRequest(state, action),

  submitConfirmationCode: (state, action) => handleRegistrationRequest(state, action),

  updateData: (state, action) => ({
    ...state,
    ...action.data
  })
};

export default createRoutingReducer(handlers, initialState);
