import { append, merge, adjust, findIndex } from 'ramda';
import createRoutingReducer from  '../lib/createRoutingReducer';

let initialState = [];

export let generateClientId = () =>
  Math.floor(Math.random() * Math.pow(10, 10)).toString(16);

export let createMessage = (message, state) => {
  return merge(message, {
    clientId: generateClientId(),
    clientTimestamp: new Date(),
    fresh: true,
    state: 'composing',
    color: '#CCC',
    width: 150,
    height: 150
  });
};

let updateById = (id, newProps, messages) => {
  let index = findIndexForId(id, messages);
  let newMessage = merge(messages[index], newProps);
  return replaceAtIndex(index, newMessage, messages);
};

let findIndexForId = (id, messages) => {
  return findIndex(m => m.id === id || m.clientId === id, messages);
};

let replaceAtIndex = (index, replacement, collection) =>
  adjust(i => replacement, index, collection);

let updateAtIndex = (index, newData, collection) =>
  adjust(m => merge(m, newData), index, collection);

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

let findWorkingMessageIndex = state =>
  findIndex((m)=> m.state === 'composing', state);

let handlers = {
  startComposingMessage: function (state, action) {
    let newState = [...state, createMessage(action.message)];
    return newState;
  },

  cancelComposingMessage: function (state, action) {
    state = state.filter(m => m.state !== 'composing');
    return state;
  },

  updateWorkingMessage: function (state, action) {
    let index = findWorkingMessageIndex(state);

    if (index === -1) {
      return state;
    } else {
      return updateAtIndex(index, action.messageData, state);
    }
  },

  sendWorkingMessage: function (state, action) {
    let index = findWorkingMessageIndex(state);

    newState = updateAtIndex(index, {
      state: 'enqueued'
    }, state);

    return newState;
  },

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
    return updateById(action.message.id || action.message.clientId, {
      fresh: false
    }, state);
  }
};

export default createRoutingReducer({
  key: 'messages',
  handlers,
  initialState
});
