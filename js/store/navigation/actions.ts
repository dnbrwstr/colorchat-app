import * as DatabaseUtils from '../../lib/DatabaseUtils';
import config from '../../config';
import {ThunkResult} from '../createStore';
import {resetMessages} from '../messages/actions';
import {
  NavigateAction,
  NAVIGATE_TO,
  NavigateBackAction,
  NAVIGATE_BACK,
  NavigateToConversationAction,
} from './types';
import {Contact} from '../contacts/types';

export let navigateTo = (
  a: string | {routeName: string; params?: any},
  b?: any,
): NavigateAction => {
  let route;

  if (typeof a === 'string') {
    route = {
      routeName: a,
      params: b,
    };
  } else {
    route = a;
  }

  return {
    type: NAVIGATE_TO,
    ...route,
  };
};

export let navigateBack = (): NavigateBackAction => {
  return {
    type: NAVIGATE_BACK,
  };
};

export const navigateToConversation = (
  contactId: number,
  contact?: Contact,
): ThunkResult<Promise<void>> => async (dispatch, getState) => {
  const user = getState().user;
  if (!user) return;
  const {messages, total} = await DatabaseUtils.loadMessages({
    contactId,
    userId: user.id,
    page: 0,
  });

  if (!config.screenshotMode) {
    dispatch(resetMessages(messages, total));
  }

  setTimeout(() => {
    dispatch(createNavigateToConversationAction(contactId, contact));
  }, 0);
};

export const createNavigateToConversationAction = (
  contactId: number,
  contact?: Contact,
): NavigateToConversationAction => {
  return {
    type: 'navigateToConversation',
    contactId,
    contact,
  };
};
