export default (handlers, initialState) =>
  (state, action) =>
    handlers[action.type] ?
      handlers[action.type](state, action) : (state || initialState);
