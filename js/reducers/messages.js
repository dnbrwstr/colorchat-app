import ramda from "ramda";
import createRoutingReducer from "../lib/createRoutingReducer";
import { createMessage, generateId } from "../lib/MessageUtils";
import config from "../config";

let {
  append,
  merge,
  adjust,
  findIndex,
  evolve,
  pipe,
  __,
  reject,
  partial,
  prepend,
  reduce,
  always,
  any,
  propEq,
  mapObjIndexed,
  concat,
  slice,
  zipWith,
  curry
} = ramda;

let KEEP_LOADED_COUNT = 50;

let initialState = {
  total: null,
  static: [],
  working: [],
  enqueued: [],
  sending: [],
  placeholder: []
};

let findMessageIndex = curry((message, messages) => {
  return findIndex(m => messageEquals(m, message), messages);
});

let messageEquals = curry((messageA, messageB) => {
  return (
    (messageA.clientId && messageA.clientId === messageB.clientId) ||
    (messageA.id && messageA.id === messageB.id)
  );
});

let addMessage = (type, message, state) => {
  if (findMessageIndex(message, state[type]) !== -1) {
    return state;
  } else {
    return evolve(
      {
        [type]: prepend(message)
      },
      state
    );
  }
};

let updateMessage = (type, message, data, state) => {
  return evolve({
    [type]: messages => {
      let index = findMessageIndex(message, messages);
      return adjust(merge(__, data), index, messages);
    }
  })(state);
};

let removeMessage = (type, message, state) => {
  return evolve(
    {
      [type]: reject(messageEquals(message))
    },
    state
  );
};

let changeMessageType = (fromType, toType, message, state) => {
  if (findMessageIndex(message, state[toType]) !== -1) {
    return state;
  } else {
    return pipe(
      partial(removeMessage, [fromType, message]),
      partial(addMessage, [toType, message])
    )(state);
  }
};

let handlers = {
  init: function(state, action) {
    return action.appState.messages || initialState;
  },

  startComposingMessage: function(state, action) {
    console.log("add working message");
    const nextState = addMessage(
      "working",
      createMessage(action.message),
      state
    );
    console.log(nextState);
    return nextState;
  },

  cancelComposingMessage: function(state, action) {
    return updateMessage(
      "working",
      action.message,
      { state: "cancelling" },
      state
    );
  },

  destroyWorkingMessage: function(state, action) {
    console.log("remove working message");
    return removeMessage("working", action.message, state);
  },

  updateWorkingMessage: function(state, action) {
    return updateMessage("working", action.message, action.messageData, state);
  },

  sendWorkingMessage: function(state, action) {
    state = pipe(
      partial(changeMessageType, ["working", "enqueued", action.message]),
      partial(updateMessage, [
        "enqueued",
        action.message,
        { state: "enqueued" }
      ])
    )(state);
    return state;
  },

  sendMessages: function(state, action) {
    return {
      started: this.handleSendMessageStart,
      complete: this.handleSendMessageCompletion,
      failed: this.handleSendMessageFailure
    }[action.state](state, action);
  },

  handleSendMessageStart: function(state, action) {
    return reduce(
      (curState, message) =>
        pipe(
          partial(changeMessageType, ["enqueued", "sending", message]),
          partial(updateMessage, ["sending", message, { state: "sending" }])
        )(curState),
      state,
      action.messages
    );
  },

  handleSendMessageCompletion: function(state, action) {
    let messagePairs = zipWith(
      (message, responseMessage) => ({ message, responseMessage }),
      action.messages,
      action.responseMessages
    );

    return reduce(
      (curState, messagePair) =>
        pipe(
          partial(changeMessageType, [
            "sending",
            "static",
            messagePair.message
          ]),
          partial(updateMessage, [
            "static",
            messagePair.message,
            merge({ state: "complete" }, messagePair.responseMessage)
          ])
        )(curState),
      state,
      messagePairs
    );
  },

  handleSendMessageFailure: function(state, action) {
    return reduce(
      (curState, message) =>
        pipe(
          partial(changeMessageType, ["enqueued", "static", message]),
          partial(changeMessageType, ["sending", "static", message]),
          partial(updateMessage, [
            "static",
            message,
            { state: "failed", error: action.error }
          ])
        )(curState),
      state,
      action.messages
    );
  },

  resendMessage: function(state, action) {
    return pipe(
      partial(changeMessageType, ["static", "enqueued", action.message]),
      partial(updateMessage, [
        "enqueued",
        action.message,
        { state: "enqueued", error: null }
      ])
    )(state);
  },

  receiveMessage: function(state, action) {
    if (!action.inCurrentConversation) return state;
    let message = merge(action.message, { state: "fresh" });
    return pipe(
      partial(this.resetComposeEvents, []),
      partial(addMessage, ["static", message])
    )(state);
  },

  markMessageStale: function(state, action) {
    return updateMessage(
      "static",
      action.message,
      { state: "complete" },
      state
    );
  },

  toggleMessageExpansion: function(state, action) {
    let expanded = !action.message.expanded;
    return updateMessage("static", action.message, { expanded }, state);
  },

  receiveComposeEvent: function(state, action) {
    if (any(propEq("senderId", action.senderId), state.placeholder)) {
      return state;
    } else {
      return evolve(
        {
          placeholder: append({
            id: generateId(),
            state: "placeholder",
            senderId: action.senderId
          })
        },
        state
      );
    }
  },

  composeEventExpire: function(state, action) {
    return evolve({
      placeholder: reject(propEq("senderId", action.senderId))
    })(state);
  },

  resetComposeEvents: function(state, action) {
    return evolve({
      placeholder: always([])
    })(state);
  },

  deleteConversation: function(state, action) {
    let id = action.conversation.recipientId;

    let inConversation = m => m.senderId === id || m.recipientId === id;

    return mapObjIndexed(reject(inConversation), state);
  },

  loadMessages: function(state, action) {
    if (action.messages) {
      return evolve(
        {
          total: always(action.total),
          static: concat(__, action.messages)
        },
        state
      );
    } else {
      return state;
    }
  },

  resetMessages: function(state, action) {
    return evolve(
      {
        static: always(action.messages),
        total: always(action.total)
      },
      state
    );
  },

  unloadOldMessages: function(state, action) {
    if (state.static.length > KEEP_LOADED_COUNT) {
      return evolve(
        {
          static: slice(0, KEEP_LOADED_COUNT)
        },
        state
      );
    } else {
      return state;
    }
  },

  logout: function(state, action) {
    return initialState;
  }
};

export default createRoutingReducer({
  key: "messages",
  handlers,
  initialState
});
