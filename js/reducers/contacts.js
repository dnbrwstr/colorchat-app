import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = {
  imported: false,
  importInProgress: false,
  importError: null,
  contacts: null
};

let handlers = {
  importContacts: (state, action) => {
    if (action.state === 'started') {
      return {
        ...state,
        importInProgress: true
      };
    } else if (action.state === 'complete') {
      return {
        ...state,
        imported: true,
        importInProgress: false,
        importError: null,
        contacts: action.contacts
      }
    } else if (action.state === 'failed') {
      return {
        ...state,
        imported: false,
        importInProgress: false,
        importError: action.error,
        contacts: null
      }
    }
  }
}

export default createRoutingReducer(handlers, initialState);
