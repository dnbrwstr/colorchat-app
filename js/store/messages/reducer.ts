import ramda from 'ramda';
import createRoutingReducer, {CaseHandlerMap} from '../createRoutingReducer';
import {createMessage, getId} from '../../lib/MessageUtils';
import {
  Message,
  MessageState,
  MessageSendState,
  SendMessagesAction,
  StartComposingMessageAction,
  LoadMessagesAction,
  UnloadOldMessagesAction,
  ResetMessagesAction,
  ReceiveMessageAction,
  ResendMessageAction,
  ToggleMessageExpansionAction,
  SendWorkingMessageAction,
  UpdateWorkingMessageAction,
  DestroyWorkingMessageAction,
  CancelComposingMessageAction,
  RECEIVE_MESSAGE,
  FinishedMessage,
  LOAD_MESSAGES,
  RESET_MESSAGES,
  UNLOAD_OLD_MESSAGES,
  TOGGLE_MESSAGE_EXPANSION,
  RESEND_MESSAGE,
  START_COMPOSING_MESSAGE,
  CANCEL_COMPOSING_MESSAGE,
  DESTROY_WORKING_MESSAGE,
  UPDATE_WORKING_MESSAGE,
  SEND_WORKING_MESSAGE,
  SEND_MESSAGES,
  RawMessageData,
} from './types';
import {
  RESET_COMPOSE_EVENTS,
  DELETE_CONVERSATION,
} from '../conversations/types';
import {
  LOGOUT,
  LogoutAction,
  DeleteAccountAction,
  DELETE_ACCOUNT,
} from '../user/types';
import {AsyncActionState} from '../../lib/AsyncAction';
import {isUndefined} from '../../lib/Utils';

const {merge, findIndex, pipe, __, partial, reduce, zipWith, curry} = ramda;

const KEEP_LOADED_COUNT = 40;

const initialState: MessageState = {
  total: 0,
  static: [],
  working: [],
  enqueued: [],
  sending: [],
};

const findMessageIndex = (message: Message, messages: Message[]) =>
  messages.findIndex(m => messageEquals(m, message));

const messageEquals = (messageA: Message, messageB: Message) => {
  return getId(messageA) === getId(messageB);
};

const isWithUser = (userId: number, message: Message) => {
  if (message.recipientId === userId) return true;
  else if (message.state === 'static' || message.state === 'fresh') {
    if (message.senderId === userId) return true;
  } else return false;
};

const mapTypes = (
  fn: (messages: Message[]) => Message[],
  state: MessageState,
) => {
  return {
    static: fn(state.static),
    working: fn(state.working),
    enqueued: fn(state.enqueued),
    sending: fn(state.sending),
  };
};

const addMessageAtBeginning = (
  type: MessageSendState,
  message: Message,
  state: MessageState,
): MessageState => {
  if (findMessageIndex(message, state[type]) !== -1) {
    return state;
  } else {
    return {
      ...state,
      [type]: [message, ...state[type]],
    };
  }
};

const addMessageAtEnd = (
  type: MessageSendState,
  message: Message,
  state: MessageState,
): MessageState => {
  if (findMessageIndex(message, state[type]) !== -1) {
    return state;
  } else {
    return {
      ...state,
      [type]: [...state[type], message],
    };
  }
};

const replaceItem = <T>(index: number, newItem: T, arr: T[]) => {
  return [...arr.slice(0, index), newItem, ...arr.slice(index + 1)];
};

const removeItem = <T>(index: number, arr: T[]) => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

const updateMessage = (
  type: MessageSendState,
  message: Message,
  data: Partial<Message>,
  state: MessageState,
): MessageState => {
  const messages = state[type];
  const index = findMessageIndex(message, messages);
  const nextMessages = replaceItem(index, {...message, ...data}, messages);
  return {
    ...state,
    [type]: nextMessages,
  };
};

const removeMessage = (
  type: MessageSendState,
  messageToRemove: Message,
  state: MessageState,
): MessageState => {
  return {
    ...state,
    [type]: state[type].filter(message => {
      return !messageEquals(message, messageToRemove);
    }),
  };
};

const changeMessageType = (
  fromType: MessageSendState,
  toType: MessageSendState,
  message: Message,
  state: MessageState,
): MessageState => {
  state = removeMessage(fromType, message, state);
  if (findMessageIndex(message, state[toType]) !== -1) {
    return state;
  } else {
    return addMessageAtBeginning(toType, message, state);
  }
};

const handleSendMessageStart = function(
  state: MessageState,
  action: SendMessagesAction,
): MessageState {
  const messages: Message[] = action.messages;
  return messages.reduce((memo, message) => {
    return updateMessage(
      'sending',
      message,
      {state: 'sending'},
      changeMessageType('enqueued', 'sending', message, memo),
    );
  }, state);
};

const handleSendMessageCompletion = function(
  state: MessageState,
  action: {messages: Message[]; result: RawMessageData[]},
) {
  const messagePairs = zipWith(
    (message, responseMessage) => ({message, responseMessage}),
    action.messages,
    action.result,
  );

  return reduce(
    (curState, messagePair) =>
      pipe(
        partial(changeMessageType, ['sending', 'static', messagePair.message]),
        partial(updateMessage, [
          'static',
          messagePair.message,
          merge({state: 'complete'}, messagePair.responseMessage),
        ]),
      )(curState),
    state,
    messagePairs,
  );
};

const handleSendMessageFailure = function(
  state: MessageState,
  action: {messages: Message[]; error: string},
) {
  state = action.messages.reduce((state, message) => {
    state = changeMessageType('enqueued', 'static', message, state);
    state = changeMessageType('sending', 'static', message, state);
    state = updateMessage('static', message, {state: 'failed'}, state);
    return state;
  }, state);
  return state;
};

const handlers: CaseHandlerMap<MessageState> = {
  [START_COMPOSING_MESSAGE](
    state: MessageState,
    action: StartComposingMessageAction,
  ) {
    return addMessageAtBeginning(
      'working',
      createMessage(action.message),
      state,
    );
  },

  [CANCEL_COMPOSING_MESSAGE](state, action: CancelComposingMessageAction) {
    return updateMessage(
      'working',
      action.message,
      {state: 'cancelling'},
      state,
    );
  },

  [DESTROY_WORKING_MESSAGE](state, action: DestroyWorkingMessageAction) {
    return removeMessage('working', action.message, state);
  },

  [UPDATE_WORKING_MESSAGE](state, action: UpdateWorkingMessageAction) {
    return updateMessage('working', action.message, action.messageData, state);
  },

  [SEND_WORKING_MESSAGE](state, action: SendWorkingMessageAction) {
    state = pipe(
      partial(changeMessageType, ['working', 'enqueued', action.message]),
      partial(updateMessage, ['enqueued', action.message, {state: 'enqueued'}]),
    )(state);
    return state;
  },

  [SEND_MESSAGES](state, action: SendMessagesAction) {
    if (action.state === AsyncActionState.Started) {
      return handleSendMessageStart(state, action);
    } else if (action.state === AsyncActionState.Complete) {
      return handleSendMessageCompletion(state, action);
    } else if (action.state === AsyncActionState.Failed) {
      return handleSendMessageFailure(state, action);
    } else {
      return state;
    }
  },

  [RESEND_MESSAGE](state, action: ResendMessageAction) {
    return pipe(
      partial(changeMessageType, ['static', 'enqueued', action.message]),
      partial(updateMessage, [
        'enqueued',
        action.message,
        {state: 'enqueued', error: null},
      ]),
    )(state);
  },

  [RECEIVE_MESSAGE](state, action: ReceiveMessageAction) {
    if (!action.inCurrentConversation) return state;
    const message: FinishedMessage = {
      ...action.message,
      state: 'fresh',
      animateEntry: true,
    };
    return addMessageAtBeginning('static', message, state);
  },

  [TOGGLE_MESSAGE_EXPANSION](state, action: ToggleMessageExpansionAction) {
    const expanded = isUndefined(action.expanded)
      ? !action.message.expanded
      : action.expanded;
    return updateMessage('static', action.message, {expanded}, state);
  },

  [RESET_COMPOSE_EVENTS](state, action) {
    return {
      ...state,
    };
  },

  [DELETE_CONVERSATION](state, action) {
    const id = action.conversation.recipientId;

    return {
      ...state,
      ...mapTypes(messages => messages.filter(m => isWithUser(id, m)), state),
    };
  },

  [LOAD_MESSAGES](state, action: LoadMessagesAction) {
    if (action.state === 'complete') {
      action.messages.forEach(m => {
        state = addMessageAtEnd('static', m, state);
      });
      return {
        ...state,
        total: action.total,
      };
    } else {
      return state;
    }
  },

  [RESET_MESSAGES](state, action: ResetMessagesAction) {
    return {
      ...state,
      static: action.messages,
      total: action.total,
    };
  },

  [UNLOAD_OLD_MESSAGES](state, action: UnloadOldMessagesAction) {
    if (state.static.length > KEEP_LOADED_COUNT) {
      return {
        ...state,
        static: state.static.slice(0, KEEP_LOADED_COUNT),
      };
    } else {
      return state;
    }
  },

  [LOGOUT](state, action: LogoutAction) {
    return initialState;
  },

  [DELETE_ACCOUNT](state, action: DeleteAccountAction) {
    return initialState;
  },
};

export default createRoutingReducer<MessageState>({
  handlers: handlers,
  initialState,
});
