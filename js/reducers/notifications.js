import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = {
  requestPermissions: false
};

let handlers = {
  triggerPermissionsDialog: function (state, action) {
    let done = action.state !== 'started';

    return {
      ...state,
      requestPermissions: done
    };
  }
};

export default createRoutingReducer({
  key: 'notifications',
  handlers,
  initialState
});
