import { append, merge, adjust, findIndex } from 'ramda';
import createRoutingReducer from  '../lib/createRoutingReducer';

let initialState = [];

let findIndexForClientId = (clientId, messages) =>
  findIndex(m => m.clientId === clientId, messages);

let replaceAtIndex = (index, replacement, collection) =>
  adjust(i => replacement, index, collection);

let addOrReplaceExisting = (message, collection) => {
  let existingIndex = findIndex(m => {
    return (m.id && m.id === message.id) ||
      (m.clientId && m.clientId === message.clientId);
  }, collection);

  let val;

  if (existingIndex !== -1) {
    val = adjust(i => message, existingIndex, collection);
  } else {
    val = append(message, collection);
  }

  return val;
};

let handlers = {
  sendMessages: function (state, action) {
    let messages = action.messages.map(m => merge(m, {
        state: action.state
      }, action.state === 'failed' && {
        error: action.error
      })
    );

    messages.forEach(m => {
      let messageIndex = findIndexForClientId(m.clientId, state);

      if (messageIndex == -1) {
        state = append(m, state);
      } else {
        state = replaceAtIndex(messageIndex, m, state);
      }
    });

    return state;
  },

  receiveMessages: function (state, action) {
    action.messages.forEach(m => state = addOrReplaceExisting(m, state));
    return state;
  }
};

export default createRoutingReducer({
  key: 'messages',
  handlers,
  initialState
});
