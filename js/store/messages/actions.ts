import NavigationService from '../../lib/NavigationService';
import * as DatabaseUtils from '../../lib/DatabaseUtils';
import {ThunkResult} from '../createStore';
import {
  Message,
  MessageAction,
  START_COMPOSING_MESSAGE,
  CANCEL_COMPOSING_MESSAGE,
  DESTROY_WORKING_MESSAGE,
  UPDATE_WORKING_MESSAGE,
  SEND_WORKING_MESSAGE,
  RESEND_MESSAGE,
  RECEIVE_MESSAGE,
  TOGGLE_MESSAGE_EXPANSION,
  LOAD_MESSAGES,
  RESET_MESSAGES,
  UNLOAD_OLD_MESSAGES,
  RawMessageData,
  FinishedMessage,
  PendingMessage,
  WorkingMessage,
} from './types';
import {getAbsoluteSize} from '../../lib/MessageUtils';

export let receiveMessage = (
  messageData: RawMessageData,
): ThunkResult<Promise<void>> => async (dispatch, getState) => {
  const message: FinishedMessage = {
    ...messageData,
    ...getAbsoluteSize(messageData),
    state: 'fresh',
    expanded: false,
  };

  await DatabaseUtils.storeMessage(message);

  const {ui} = getState();
  let inCurrentConversation =
    NavigationService.getCurrentRoute().routeName === 'conversation' &&
    ui.conversation.contactId === message.senderId;

  dispatch(createReceiveMessageAction(inCurrentConversation, message));
};

const createReceiveMessageAction = (
  inCurrentConversation: boolean,
  message: FinishedMessage,
): MessageAction => {
  return {
    type: RECEIVE_MESSAGE,
    inCurrentConversation,
    message,
  };
};

export const startComposingMessage = (
  message: WorkingMessage,
): MessageAction => {
  return {
    type: START_COMPOSING_MESSAGE,
    message,
  };
};

export const cancelComposingMessage = (
  message: WorkingMessage,
): MessageAction => {
  return {
    type: CANCEL_COMPOSING_MESSAGE,
    message,
  };
};

export const destroyWorkingMessage = (
  message: WorkingMessage,
): MessageAction => {
  return {
    type: DESTROY_WORKING_MESSAGE,
    message,
  };
};

export const updateWorkingMessage = (
  message: Message,
  messageData: Partial<Message>,
): ThunkResult<void> => (dispatch, getState) => {
  const user = getState().user;
  const id = user ? user.id : 0;
  const data = {
    ...messageData,
    senderId: id,
  };
  dispatch(createUpdateWorkingMessageAction(message, data));
};

const createUpdateWorkingMessageAction = (
  message: Message,
  messageData: Partial<Message>,
): MessageAction => {
  return {
    type: UPDATE_WORKING_MESSAGE,
    message,
    messageData,
  };
};

export let sendWorkingMessage = (message: PendingMessage): MessageAction => {
  return {
    type: SEND_WORKING_MESSAGE,
    message,
  };
};

export let resendMessage = (message: Message): MessageAction => {
  return {
    type: RESEND_MESSAGE,
    message,
  };
};

export let toggleMessageExpansion = (
  message: FinishedMessage,
): MessageAction => {
  return {
    type: TOGGLE_MESSAGE_EXPANSION,
    message,
  };
};

export let loadMessages = (
  contactId: number,
  page = 1,
): ThunkResult<Promise<void>> => async (dispatch, getState) => {
  let per = 20;

  dispatch(createLoadMessagesStartedAction(contactId));

  const state = getState();
  const userId = state.user ? state.user.id : -1;

  const {messages, total} = await DatabaseUtils.loadMessages({
    contactId,
    userId,
    page,
    per,
  });

  dispatch(createLoadMessagesCompleteAction(messages, total));
};

const createLoadMessagesStartedAction = (contactId: number): MessageAction => {
  return {
    type: LOAD_MESSAGES,
    state: 'started',
    contactId,
  };
};

const createLoadMessagesCompleteAction = (
  messages: Message[],
  total: number,
): MessageAction => {
  return {
    type: LOAD_MESSAGES,
    state: 'complete',
    messages,
    total,
  };
};

export const resetMessages = (
  messages: Message[],
  total: number,
): MessageAction => {
  return {
    type: RESET_MESSAGES,
    messages,
    total,
  };
};

export const unloadOldMessages = (): MessageAction => {
  return {
    type: UNLOAD_OLD_MESSAGES,
  };
};
