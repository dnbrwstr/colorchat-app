import ramda from 'ramda';
import createRoutingReducer from  '../lib/createRoutingReducer';
import { createMessage } from '../lib/MessageUtils';
import config from '../config';

let {
  append, merge, adjust, findIndex, filter, remove,
  evolve, pipe, equals, __, reject, partial,
  ifElse, identity, reduce, when, always, none,
  propEq, times, mapObjIndexed, concat
} = ramda;

let initialState = {
  total: null,
  static: [],
  working: [],
  enqueued: [],
  sending: [],
  placeholder: []
};

let addMessage = (type, message, state) => {
  return evolve({
    [type]: append(message)
  }, state);
};

let updateMessage = (type, message, data, state) => {
  return evolve({
    [type]: (messages) => {
      let index = findIndex(equals(message), messages);
      return adjust(merge(__, data), index, messages)
    }
  })(state);
};

let removeMessage = (type, message, state) => {
  return evolve({
    [type]: reject(equals(message))
  }, state);
};

let changeMessageType = (fromType, toType, message, state) => {
  return pipe(
    partial(removeMessage, [fromType, message]),
    partial(addMessage, [toType, message])
  )(state);
};

let handlers = {
  init: function (state, action) {
    return action.appState.messages || initialState;
  },

  startComposingMessage: function (state, action) {
    return addMessage('working', createMessage(action.message), state);
  },

  cancelComposingMessage: function (state, action) {
    return updateMessage('working', action.message, { state: 'cancelling' }, state);
  },

  destroyWorkingMessage: function (state, action) {
    return removeMessage('working', action.message, state);
  },

  updateWorkingMessage: function (state, action) {
    return updateMessage('working', action.message, action.messageData, state);
  },

  sendWorkingMessage: function (state, action) {
    state = pipe(
      partial(changeMessageType, ['working', 'enqueued', action.message]),
      partial(updateMessage, ['enqueued', action.message, { state: 'enqueued' }])
    )(state);
    return state;
  },

  sendMessages: function (state, action) {
    return {
      started: this.handleSendMessageStart,
      complete: this.handleSendMessageCompletion,
      failed: this.handleSendMessageFailure
    }[action.state](state, action);
  },

  handleSendMessageStart: function (state, action) {
    return reduce((curState, message) => pipe(
      partial(changeMessageType, ['enqueued', 'sending', message]),
      partial(updateMessage, ['sending', message, { state: 'sending' }])
    )(curState), state, action.messages);
  },

  handleSendMessageCompletion: function (state, action) {
    return reduce((curState, message) => pipe(
      partial(changeMessageType, ['sending', 'static', message]),
      partial(updateMessage, ['static', message, { state: 'complete' }])
    )(curState), state, action.messages);
  },

  handleSendMessageFailure: function (state, action) {
    return reduce((curState, message) => pipe(
      partial(changeMessageType, ['sending', 'static', message]),
      partial(updateMessage, ['static', message, { state: 'failed', error: action.error }])
    )(curState), state, action.messages);
  },

  receiveMessage: function (state, action) {
    let message = merge(action.message, { state: 'fresh' });
    return addMessage('static', message, state);
  },

  markMessageStale: function (state, action) {
    return updateMessage('static', action.message, { state: 'complete' }, state);
  },

  toggleMessageExpansion: function (state, action) {
    let expanded = !action.message.expanded;
    return updateMessage('static', action.message, { expanded }, state);
  },

  receiveComposeEvent: function (state, action) {
    return evolve({
      placeholder: when(
        none(propEq('senderId', action.senderId)),
        append({ state: 'placeholder', senderId: action.senderId })
      )
    })(state);
  },

  composeEventExpire: function (state, action) {
    return evolve({
      placeholder: reject(propEq('senderId', action.senderId))
    })(state);
  },

  resetComposeEvents: function (state, action) {
    return evolve({
      placeholder: always([])
    })(state);
  },

  deleteConversation: function (state, action) {
    let id = action.conversation.recipientId;

    let inConversation = m =>
      m.senderId === id || m.recipientId === id;

    return mapObjIndexed(reject(inConversation), state);
  },

  loadMessages: function (state, action) {
    if (action.messages) {
      return evolve({
        total: always(action.total),
        static: concat(__, action.messages)
      }, state);
    } else {
      return state;
    }
  },

  unloadOldMessages: function (state, action) {
    if (state.static.length > KEEP_LOADED_COUNT) {
      return evolve({
        static: slice(0, KEEP_LOADED_COUNT)
      }, state);
    } else {
      return state;
    }
  }
};

export default createRoutingReducer({
  key: 'messages',
  handlers,
  initialState
});
