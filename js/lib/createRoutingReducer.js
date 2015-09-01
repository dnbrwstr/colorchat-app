import { merge } from 'ramda';

export default (options) => {
  let { key, handlers, initialState } = options;

  let finalHandlers = merge({
    init: (state, action) => action.appState[key] || initialState
  }, handlers);

  return (state, action) => {
    return finalHandlers[action.type] ?
      finalHandlers[action.type](state, action) : (state || initialState);
  }
}
