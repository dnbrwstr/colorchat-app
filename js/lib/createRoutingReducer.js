import { merge } from "ramda";

export default options => {
  let { key, handlers, initialState } = options;

  let finalHandlers = merge(
    {
      init: (state, action) => action.appState[key] || initialState,
      deleteAccount: (state, action) => {
        if (action.state === "complete") {
          return initialState;
        } else {
          return state;
        }
      }
    },
    handlers
  );

  return (state, action) => {
    return finalHandlers[action.type]
      ? finalHandlers[action.type](state, action)
      : state || initialState;
  };
};
