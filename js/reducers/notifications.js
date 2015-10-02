import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = {
  requestPermissions: false
};

let handlers = {
  triggerPermissionsDialog: function (state, action) {
    return {
      ...state,
      requestPermissions: true
    };
  }
};

export default createRoutingReducer({
  key: 'notifications',
  handlers,
  initialState
});
