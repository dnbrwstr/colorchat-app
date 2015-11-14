import { assocPath, assoc, adjust, merge, filter } from 'ramda'
import createRoutingReducer from '../lib/createRoutingReducer';
import { generateId } from '../lib/MessageUtils';

let initialState = {
  alerts: [],
  signup: {
    loading: false,
    error: null
  },
  confirmationCode: {
    loading: false,
    error: null
  },
  countryPicker: {},
  main: {
    currentTabTitle: 'Contacts',
  },
  contacts: {
    imported: false,
    importInProgress: false,
    importError: null,
    shouldRefresh: true
  },
  inbox: {},
  conversation: {
    sending: false,
    composing: false,
    cancelling: false,
    loading: false,
    colorPicker: 'simple'
  }
};

let getSignupState = action => ({
  started: {
    loading: true
  },
  complete: {
    loading: false,
    error: null
  },
  failed: {
    loading: false,
    error: action.error || 'Network request failed'
  }
}[action.state]);

let getContactsState = action => ({
  started: {
    importInProgress: true
  },
  complete: {
    imported: true,
    importInProgress: false,
    importError: null,
    shouldRefresh: false
  },
  failed: {
    importInProgress: false,
    importError: action.error
  }
}[action.state]);

let handleRequest = (key, action, getStateFn, reducerState) => {
  let data = getStateFn(action);
  if (!data) return reducerState;
  return assoc(key, merge(reducerState[key], data), reducerState);
};

let handlers = {
  registerPhoneNumber: function (state, action) {
    return handleRequest('signup', action, getSignupState, state);
  },

  clearSignupError: function (state, action) {
    return assocPath(['signup', 'error'], null, state);
  },

  submitConfirmationCode: function (state, action) {
    return handleRequest('confirmationCode', action, getSignupState, state);
  },

  clearConfirmCodeError: function (state, action) {
    return assocPath(['confirmatonCode', 'error'], null, state);
  },

  setMainTab: function (state, action) {
    return assocPath(['main', 'currentTabTitle'], action.tabTitle, state);
  },

  importContacts: function (state, action) {
    return handleRequest('contacts', action, getContactsState, state);
  },

  updateConversationUi: function (state, action) {
    let newData = merge(state.conversation, action.data);
    return assoc('conversation', newData, state);
  },

  startComposingMessage: function (state, action) {
    return assocPath(['conversation', 'composing'], true, state)
  },

  cancelComposingMessage: function (state, action) {
    return assoc('conversation', merge(state.conversation, {
      composing: false,
      cancelling: true
    }), state);
  },

  presentInternalAlert: function (state, action) {
    let alert = merge(action.data, { id: generateId() });
    let newAlerts = (state.alerts || []).concat([alert]);
    return assoc('alerts', newAlerts, state);
  },

  dismissInternalAlert: function (state, action) {
    let newAlerts = filter(i => i.id !== action.alertId, state.alerts);
    return assoc('alerts', newAlerts, state);
  },

  changeAppState: function (state, action) {
    if (action.newState === 'active') {
      return assocPath(['contacts', 'shouldRefresh'], true, state);
    } else {
      return state;
    }
  }
};

export default createRoutingReducer({
  key: 'ui',
  handlers,
  initialState
});
