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
  sendMessage: function (state, action) {
    let  message = merge(action.message, {
      state: action.state
    });

    if (action.state === 'started') {
      return append(message, state)
    } else if (action.state === 'failed') {
      let messageIndex = findIndexForClientId(message.clientId, state);
      let finalMessage = merge(messageIndex, { error: action.error });
      return replaceAtIndex(messageIndex, finalMessage, state);
    } else if (action.state === 'complete') {
      let messageIndex = findIndexForClientId(message.clientId, state);
      return replaceAtIndex(messageIndex, message, state);
    }
  },

  receiveMessage: function (state, action) {
    return addOrReplaceExisting(action.message, state);
  },

  receivePendingMessages: function (state, action) {
    let messages = state;
    action.messages.forEach(m => messages = addOrReplaceExisting(m, messages));
    return messages;
  }
};

export default createRoutingReducer(handlers, initialState);
