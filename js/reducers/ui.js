import { assocPath, assoc } from 'ramda'
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
    imported: false,
    importInProgress: false,
    importError: null
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

  importContacts: (state, action) => {
    let assocContacts = data =>
      assoc('contacts', merge(state.contacts, data), state);

    if (action.state === 'started') {
      return assocContacts({
        importInProgress: true
      });
    } else if (action.state === 'complete') {
      return assocContacts({
        imported: true,
        importInProgress: false,
        importError: null
      });
    } else if (action.state == 'failed') {
      return assocContacts({
        importInProgress: false,
        importError: action.error
      });
    } else {
      return state;
    }
  },

  toggleComposingMessage: (state, action) =>
    assocPath(['conversation', 'composing'], action.value, state),

  selectColorPicker: (state, action) =>
    assocPath(['conversation', 'colorPicker'], action.value, state)

};

export default createRoutingReducer(handlers, initialState);