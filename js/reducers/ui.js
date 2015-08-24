import { assocPath } from 'ramda'
import createRoutingReducer from '../lib/createRoutingReducer';
import merge from 'merge';

let initialState = {
  signup: {
    loading: false,
    error: null
  },
  confirmationCode: {
    loading: false,
    error: null
  },
  countryPicker: {

  },
  main: {
    currentTabId: 0,
  },
  contacts: {

  },
  inbox: {

  },
  conversation: {
    composing: false,
    colorPicker: 'simple'
  }
}

let handleRequest = (prop, state, action) => {
  let newValues = {
    started: {
      loading: true
    },
    failed: {
      loading: false,
      error: action.error
    },
    complete: {
      loading: false,
      error: null
    }
  }[action.state];

  let val = merge({}, state[prop], newValues);
  let mergeVal = {}
  mergeVal[prop] = val;

  return merge({}, state, mergeVal);
}

let handlers = {
  registerPhoneNumber: (state, action) =>
    handleRequest('signup', state, action),

  submitConfirmationCode: (state, action) =>
    handleRequest('submitConfirmationCode', state, action),

  changeMainTab: (state, action) =>
    assocPath(['main', 'currentTabId'], action.tabId, state),

  toggleComposingMessage: (state, action) =>
    assocPath(['conversation', 'composing'], action.value, state),

  selectColorPicker: (state, action) =>
    assocPath(['conversation', 'colorPicker'], action.value, state)
};

export default createRoutingReducer(handlers, initialState);