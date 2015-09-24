import { append, merge, adjust, findIndex } from 'ramda';
import createRoutingReducer from  '../lib/createRoutingReducer';

let initialState = [];

let updateMessageById = (id, newProps, messages) => {
  let index = findIndexForId(id, messages);
  let newMessage = merge(messages[index], newProps);
  return replaceAtIndex(index, newMessage, messages);
};

let findIndexForId = (id, messages) => {
  return findIndex(m => m.id === id || m.clientId === id, messages);
};

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
      let messageIndex = findIndexForId(m.clientId, state);

      if (messageIndex == -1) {
        state = append(m, state);
      } else {
        state = replaceAtIndex(messageIndex, m, state);
      }
    });

    return state;
  },

  receiveMessages: function (state, action) {
    action.messages
      .map(m => merge(m, {fresh: true}))
      .forEach(m => state = addOrReplaceExisting(m, state));
    return state;
  },

  markMessageStale: function (state, action) {
    return updateMessageById(action.message.id || action.message.clientId, {
      fresh: false
    }, state);
  }
};

export default createRoutingReducer({
  key: 'messages',
  handlers,
  initialState
});
