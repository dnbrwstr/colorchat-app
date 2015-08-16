import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = {
  token: null
};

let handlers = {
  submitConfirmationCode: (state, action) => {
    if (action.state == 'complete') {
      return {
        token: action.token
      }
    } else {
      return state;
    }
  }
};

export default createRoutingReducer(handlers, initialState);