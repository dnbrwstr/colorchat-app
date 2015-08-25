import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = {
  token: null
};

let handlers = {
  submitConfirmationCode: (state, action) => {
    if (action.state == 'complete') {
      return {
        ...state,
        ...action.data.user
      }
    } else {
      return state;
    }
  }
};

export default createRoutingReducer(handlers, initialState);