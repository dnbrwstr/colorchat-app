import React from 'react-native';
import { merge, find, propEq, anyPass, filter, map, zipWith } from 'ramda';
import { InteractionManager } from 'react-native';
import { postJSON } from '../lib/RequestHelpers';
import { serverRoot } from '../config';
import * as DatabaseUtils from '../lib/DatabaseUtils';

export let receiveMessage = message => async (dispatch, getState) => {
  let { contacts, navigation } = getState();
  let contactIds = contacts.map(c => c.id);

  if (contactIds.indexOf(message.senderId) === -1) {
    return;
  }

  await DatabaseUtils.storeMessage(message);

  if (navigation.route.title !== 'conversation' ||
      navigation.route.data.contactId !== message.senderId) {
    return;
  }

  dispatch({
    type: 'receiveMessage',
    message
  });
};

export let startComposingMessage = message => {
  return {
    type: 'startComposingMessage',
    message
  };
};

export let cancelComposingMessage = message => {
  return {
    type: 'cancelComposingMessage',
    message
  };
};

export let destroyWorkingMessage = message => {
  return {
    type: 'destroyWorkingMessage',
    message
  };
};

export let updateWorkingMessage = (message, messageData) => (dispatch, getState) => {
  let data = merge(messageData, {
    senderId: getState().user.id,
  });

  dispatch({
    type: 'updateWorkingMessage',
    message,
    messageData: data
  });
};

export let sendWorkingMessage = message => {
  return {
    type: 'sendWorkingMessage',
    message
  };
};

export let sendMessages = (messages, state, data) => async (dispatch, getState) => {
  if (state === 'complete') {
    map(DatabaseUtils.storeMessage, zipWith(
      merge,
      messages,
      data.responseMessages
    ));
  }

  dispatch({
    type: 'sendMessages',
    messages,
    state,
    ...data
  });
};

export let resendMessage = message => {
  return {
    type: 'resendMessage',
    message
  }
};

export let markMessageStale = message => {
  return {
    type: 'markMessageStale',
    message
  }
};

export let toggleMessageExpansion = message => {
  return {
    type: 'toggleMessageExpansion',
    message
  }
};

export let loadMessages = (contactId, page=1) => async (dispatch, getState) => {
  let per = 20;

  dispatch({
    type: 'loadMessages',
    state: 'started',
    contactId
  });

  let { messages, total } = await DatabaseUtils.loadMessages({
    contactId,
    page,
    per
  });

  messages = messages.map(m => merge(m, { state: 'complete' }));

  dispatch({
    type: 'loadMessages',
    state: 'complete',
    messages,
    total
  });
};

export let unloadOldMessages = () => {
  return {
    type: 'unloadOldMessages'
  };
};
