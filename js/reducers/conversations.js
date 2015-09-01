import { findIndex, propEq, append, adjust, merge } from 'ramda';
import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = [];

let createOrUpdateConversation = (conversation, state) => {
  let finder = propEq('recipientId', conversation.recipientId);
  let index = findIndex(finder, state);

  if (index === -1) {
    return append(conversation, state);
  } else {
    return adjust(i => merge(i, conversation), index, state);
  }
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

  sendMessage: function (state, action) {
    return createOrUpdateConversation({
      recipientId: action.message.recipientId,
      lastMessage: action.message
    }, state);
  },

  receiveMessage: function (state, action) {
    return createOrUpdateConversation({
      recipientId: action.message.senderId,
      lastMessage: action.message
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
  }
};

export default createRoutingReducer({
  key: 'conversations',
  handlers,
  initialState
});
