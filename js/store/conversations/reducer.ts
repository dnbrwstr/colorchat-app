import {last, filter} from 'ramda';
import createRoutingReducer, {CaseHandlerMap} from '../createRoutingReducer';
import {
  ConversationState,
  Conversation,
  RECEIVE_COMPOSE_EVENT,
  ReceiveComposeEventAction,
  EXPIRE_COMPOSE_EVENT,
  ExpireComposeEventAction,
  DELETE_CONVERSATION,
  DeleteConversationAction,
} from './types';
import {LoadCompleteAction, LOAD_COMPLETE} from '../load/types';
import {
  RECEIVE_MESSAGE,
  ReceiveMessageAction,
  SEND_MESSAGES,
  SendMessagesAction,
} from '../messages/types';
import {
  BlockUserAction,
  BLOCK_USER,
  LOGOUT,
  LogoutAction,
  DELETE_ACCOUNT,
  DeleteAccountAction,
} from '../user/types';
import {getReferenceDate} from '../../lib/MessageUtils';
import {isUndefined} from '../../lib/Utils';
import {NavigateToConversationAction} from '../navigation/types';
import {getContactName} from '../../lib/ContactUtils';

const initialState: ConversationState = [];

const createOrUpdateConversation = (
  conversation: Conversation,
  state: ConversationState,
) => {
  const index = state.findIndex(
    c => c.recipientId === conversation.recipientId,
  );

  let newState;
  if (index === -1) {
    newState = [...state, conversation];
  } else {
    newState = [
      ...state.slice(0, index),
      {...state[index], ...conversation},
      ...state.slice(index + 1),
    ];
  }

  return newState.sort((a, b) => {
    const dateA = getMessageDate(a);
    const dateB = getMessageDate(b);
    return dateA.getTime() - dateB.getTime();
  });
};

const getMessageDate = (conversation: Partial<Conversation>): Date => {
  const message = conversation.lastMessage;
  if (!message) return new Date(0);
  return getReferenceDate(message);
};

const updateConversationIfExists = (
  conversation: Partial<Conversation>,
  state: ConversationState,
) => {
  const index = state.findIndex(
    c => c.recipientId === conversation.recipientId,
  );

  let newState;
  if (index === -1) {
    return state;
  } else {
    newState = [
      ...state.slice(0, index),
      {...state[index], ...conversation},
      ...state.slice(index + 1),
    ];
    return newState;
  }
};

const getConversation = (recipientId: number, state: ConversationState) => {
  return state.find(c => c.recipientId === recipientId);
};

const removeConversation = (contactId: number, state: ConversationState) =>
  filter(c => c.recipientId !== contactId, state);

const handlers: CaseHandlerMap<ConversationState> = {
  [LOAD_COMPLETE]: (state, action: LoadCompleteAction) => {
    const startState = action.data.conversations || initialState;
    return startState.map(c => ({...c, partnerIsComposing: false}));
  },

  navigateToConversation: function(
    state,
    action: NavigateToConversationAction,
  ) {
    const conversationProps: Conversation = {
      recipientId: action.contactId,
      unread: false,
      partnerIsComposing: false,
    };
    if (action.contact) {
      conversationProps.recipientName = getContactName(action.contact);
    }
    return createOrUpdateConversation(conversationProps, state);
  },

  [SEND_MESSAGES]: function(state, action: SendMessagesAction) {
    if (!action.messages.length) return state;
    const lastMessage = action.messages[action.messages.length - 1];
    return createOrUpdateConversation(
      {
        recipientId: lastMessage.recipientId,
        lastMessage: lastMessage,
        unread: false,
      },
      state,
    );
  },

  [RECEIVE_MESSAGE]: function(state, action: ReceiveMessageAction) {
    const conversation = getConversation(action.message.senderId, state);

    return createOrUpdateConversation(
      {
        recipientId: action.message.senderId,
        recipientAvatar:
          action.message.senderAvatar || conversation?.recipientAvatar,
        recipientName:
          conversation?.recipientName || action.message.senderName || 'Unknown',
        lastMessage: action.message,
        unread: !action.inCurrentConversation,
        partnerIsComposing: false,
      },
      state,
    );
  },

  [RECEIVE_COMPOSE_EVENT]: function(state, action: ReceiveComposeEventAction) {
    return updateConversationIfExists(
      {
        recipientId: action.data.senderId,
        partnerIsComposing: true,
      },
      state,
    );
  },

  [EXPIRE_COMPOSE_EVENT]: function(state, action: ExpireComposeEventAction) {
    return updateConversationIfExists(
      {
        recipientId: action.data.senderId,
        partnerIsComposing: false,
      },
      state,
    );
  },

  [BLOCK_USER]: function(state, action: BlockUserAction) {
    if (!isUndefined(action.userId)) {
      return removeConversation(action.userId, state);
    } else {
      return state;
    }
  },

  [DELETE_CONVERSATION]: function(state, action: DeleteConversationAction) {
    return removeConversation(action.conversation.recipientId, state);
  },

  [LOGOUT]: function(state, action: LogoutAction) {
    return initialState;
  },

  [DELETE_ACCOUNT]: function(state, action: DeleteAccountAction) {
    return initialState;
  },
};

export default createRoutingReducer({
  handlers,
  initialState,
});
