import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = {
  country: 'United States',
  countryCode: '1',
  phoneNumber: '',
  confirmationCode: '',
  error: false,
  loading: false
};

let handleSignupRequest = (state, action) => {
  if (action.state === 'started') {
    return {
      ...state,
      loading: true,
      error: false
    }
  } else if (action.state === 'complete') {
    return {
      ...state,
      loading: false,
      error: false
    }
  } else if (action.state === 'failed') {
    return {
      ...state,
      loading: false,
      error: action.error
    }
  }
}

let handlers = {
  registerPhoneNumber: (state, action) => handleSignupRequest(state, action),

  submitConfirmationCode: (state, action) => handleSignupRequest(state, action),

  updateData: (state, action) => ({
    ...state,
    ...action.data
  })
};

export default createRoutingReducer(handlers, initialState);
