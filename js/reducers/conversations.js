import {
  findIndex,
  propEq,
  append,
  adjust,
  merge,
  sortBy,
  last,
  filter
} from "ramda";
import createRoutingReducer from "../lib/createRoutingReducer";

let initialState = [];

let createOrUpdateConversation = (conversation, state) => {
  let finder = propEq("recipientId", conversation.recipientId);
  let index = findIndex(finder, state);
  let newState;

  if (index === -1) {
    newState = append(conversation, state);
  } else {
    newState = adjust(i => merge(i, conversation), index, state);
  }

  return sortBy(c => {
    if (c.lastMessage) {
      return (
        -new Date(c.lastMessage.createdAt) ||
        new Date(c.lastMessage.clientTimestamp)
      );
    } else {
      return -new Date(0);
    }
  }, newState);
};

const updateConversationIfExists = (conversation, state) => {
  let finder = propEq("recipientId", conversation.recipientId);
  let index = findIndex(finder, state);
  if (index === -1) return state;
  return adjust(i => merge(i, conversation), index, state);
};

let handlers = {
  init: (state, action) => {
    const startState = action.appState.conversations || initialState;
    return startState.map(c => ({ ...c, partnerIsComposing: false }));
  },

  navigateToConversation: function(state, action) {
    return createOrUpdateConversation(
      {
        recipientId: action.contactId,
        unread: false
      },
      state
    );
  },

  sendMessages: function(state, action) {
    if (!action.messages.length) return state;

    return createOrUpdateConversation(
      {
        recipientId: last(action.messages).recipientId,
        lastMessage: last(action.messages),
        unread: false
      },
      state
    );
  },

  receiveMessage: function(state, action) {
    return createOrUpdateConversation(
      {
        recipientId: action.message.senderId,
        recipientName: action.message.senderName,
        lastMessage: action.message,
        unread: !action.inCurrentConversation,
        partnerIsComposing: false
      },
      state
    );
  },

  receiveComposeEvent: function(state, action) {
    return updateConversationIfExists(
      {
        recipientId: action.senderId,
        partnerIsComposing: true
      },
      state
    );
  },

  composeEventExpire: function(state, action) {
    return updateConversationIfExists(
      {
        recipientId: action.senderId,
        partnerIsComposing: false
      },
      state
    );
  },

  deleteConversation: function(state, action) {
    return filter(
      c => c.recipientId !== action.conversation.recipientId,
      state
    );
  }
};

export default createRoutingReducer({
  key: "conversations",
  handlers,
  initialState
});
