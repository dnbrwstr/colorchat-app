import NavigationService from '../../lib/NavigationService';
import DatabaseManager from '../../lib/DatabaseManager';
import {
  DeleteConversationAction,
  Conversation,
  DELETE_CONVERSATION,
  MARK_CONVERSATION_READ,
  MarkConversationReadAction,
  ComposeEventData,
  ReceiveComposeEventAction,
  RECEIVE_COMPOSE_EVENT,
  ExpireComposeEventAction,
  EXPIRE_COMPOSE_EVENT,
  RESET_COMPOSE_EVENTS,
  ResetComposeEventsAction,
} from './types';
import {ThunkResult} from '../createStore';

const COMPOSE_EVENT_TIMEOUT = 5000;

export const deleteConversation = (
  conversation: Conversation,
): DeleteConversationAction => {
  return {
    type: DELETE_CONVERSATION,
    conversation,
  };
};

export const markConversationRead = (
  contactId: number,
): ThunkResult<void> => async (dispatch, getState) => {
  const userId = getState().user?.id;
  if (!userId) return;

  await DatabaseManager.markConversationRead(userId, contactId);

  dispatch(createMarkConversationReadAction(contactId));
};

export const createMarkConversationReadAction = (
  contactId: number,
): MarkConversationReadAction => {
  return {
    type: MARK_CONVERSATION_READ,
    contactId,
  };
};

let composeTimeout: number;

export const receiveComposeEvent = (
  data: ComposeEventData,
): ThunkResult<void> => (dispatch, getState) => {
  const contactId = getState().ui.conversation?.contactId;
  const routeName = NavigationService.getCurrentRoute()?.routeName;

  if (routeName !== 'conversation' || contactId !== data.senderId) {
    return;
  }

  dispatch(createReceiveComposeEventAction(data));

  clearTimeout(composeTimeout);

  composeTimeout = setTimeout(() => {
    dispatch(createExpireComposeEventAction(data));
  }, COMPOSE_EVENT_TIMEOUT);
};

export const createReceiveComposeEventAction = (
  data: ComposeEventData,
): ReceiveComposeEventAction => {
  return {type: RECEIVE_COMPOSE_EVENT, data};
};

export const createExpireComposeEventAction = (
  data: ComposeEventData,
): ExpireComposeEventAction => {
  return {
    type: EXPIRE_COMPOSE_EVENT,
    data,
  };
};

export const resetComposeEvents = (): ResetComposeEventsAction => ({
  type: RESET_COMPOSE_EVENTS,
});
