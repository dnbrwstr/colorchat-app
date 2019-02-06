import createRoutingReducer from "../lib/createRoutingReducer";

let initialState = {
  requestPermissions: false
};

let handlers = {
  triggerPermissionsDialog: function(state, action) {
    return {
      ...state,
      requestPermissions: true
    };
  },

  saveDeviceToken: function(state, action) {
    return {
      ...state,
      requestPermissions: false
    };
  }
};

export default createRoutingReducer({
  key: "notifications",
  handlers,
  initialState
});
