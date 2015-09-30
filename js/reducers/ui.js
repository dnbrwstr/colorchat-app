import { assocPath, assoc, adjust, merge } from 'ramda'
import createRoutingReducer from '../lib/createRoutingReducer';

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
    currentTabTitle: 'Contacts',
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

  if (action.state === 'failed') {
    newValues.error = {
      'Network request failed': 'Unable to reach server'
    }[action.error] || action.error
  }

  let ret = assoc(prop, merge(state[prop], newValues), state);
  return ret;
}

let handlers = {
  registerPhoneNumber: (state, action) =>
    handleRequest('signup', state, action),

  clearSignupError: (state, action) =>
    assocPath(['signup', 'error'], null, state),

  submitConfirmationCode: (state, action) =>
    handleRequest('confirmationCode', state, action),

  clearConfirmCodeError: (state, action) =>
    assocPath(['confirmatonCode', 'error'], null, state),

  setMainTab: (state, action) =>
    assocPath(['main', 'currentTabTitle'], action.tabTitle, state),

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

  updateConversationUi: function (state, action) {
    let newData = merge(state.conversation, action.data);
    return assoc('conversation', newData, state);
  },

  startComposingMessage: function (state, action) {
    return assocPath(['conversation', 'composing'], true, state)
  },

  cancelComposingMessage: function (state, action) {
    return assocPath(['conversation', 'composing'], false, state);
  }
};

export default createRoutingReducer({
  key: 'ui',
  handlers,
  initialState
});
