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
    let message = merge(action.message, {
      state: action.state
    }, action.state === 'failed' && {
      error: action.error
    });

    let messageIndex = findIndexForClientId(message.clientId, state);

    if (messageIndex == -1) {
      return append(message, state);
    } else {
      return replaceAtIndex(messageIndex, message, state);
    }
  },

  sendMessageBatch: function (state, action) {
    action.messages.forEach(m => {
      let action = merge(action, {
        message: m
      });

      state = this.sendMessage(state, action)
    });

    return state;
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
