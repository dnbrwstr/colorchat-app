import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = {
  country: 'United States',
  countryCode: '1',
  baseNumber: '',
  confirmationCode: ''
};

let handlers = {
  updateData: (state, action) => ({
    ...state,
    ...action.data
  })
};

export default createRoutingReducer({
  key: 'signup',
  handlers,
  initialState
});
