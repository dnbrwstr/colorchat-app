import { merge } from 'ramda';
import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = {
  id: null,
  name: null,
  phoneNumber: null,
  token: null,
  deviceToken: null,
  deviceTokenSaved: false
};

let handlers = {
  authError: (state, action) => {
    return {
      ...state,
      token: null
    };
  },

  submitConfirmationCode: (state, action) => {
    if (action.state == 'complete') {
      return {
        ...state,
        ...action.data.user
      }
    } else {
      return state;
    }
  },

  saveDeviceToken: (state, action) => {
    return merge(state, {
      deviceToken: action.deviceToken,
      deviceTokenSaved: action.state === 'complete'
    });
  },

  loadUserInfo: (state, action) => {
    if (action.state === 'complete') {
      return merge(state, action.data);
    } else {
      return state;
    }
  },

  updateUserInfo: (state, action) => {
    return merge(state, action.data);
  }
};

export default createRoutingReducer({
  key: 'user',
  handlers,
  initialState
});
