import { findIndex, propEq, append, adjust, merge, sortBy, last, filter } from 'ramda';
import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = [];

let createOrUpdateConversation = (conversation, state) => {
  let finder = propEq('recipientId', conversation.recipientId);
  let index = findIndex(finder, state);
  let newState;

  if (index === -1) {
    newState = append(conversation, state);
  } else {
    newState = adjust(i => merge(i, conversation), index, state);
  }

  return sortBy(c => {
    if (c.lastMessage) {
      return -new Date(c.lastMessage.createdAt) || new Date(c.lastMessage.clientTimestamp)
    } else {
      return -new Date(0);
    }
  }, newState);
}

let handlers = {
  navigateTo: function (state, action) {
    if (action.route.title === 'conversation') {
      return createOrUpdateConversation({
        recipientId: action.route.data.contactId
      }, state);
    } else {
      return state;
    }
  },

  sendMessages: function (state, action) {
    if (!action.messages.length) return state;

    return createOrUpdateConversation({
      recipientId: last(action.messages).recipientId,
      lastMessage: last(action.messages)
    }, state);
  },

  receiveMessages: function (state, action) {
    if (!action.messages.length) return state;

    return createOrUpdateConversation({
      recipientId: last(action.messages).senderId,
      lastMessage: last(action.messages)
    }, state);
  },

  receivePendingMessages: function (state, action) {
    let conversations = state;
    action.messages.forEach(m => {
      conversations = createOrUpdateConversation({
        recipientId: m.senderId,
        lastMessage: m
      }, conversations);
    });
    return conversations;
  },

  deleteConversation: function (state, action) {
    return filter(
      c => c.recipientId !== action.conversation.recipientId,
      state
    );
  }
};

export default createRoutingReducer({
  key: 'conversations',
  handlers,
  initialState
});
