import React from 'react-native';
import { merge, find, propEq, anyPass, filter } from 'ramda';
import { InteractionManager } from 'react-native';
import { postJSON } from '../lib/RequestHelpers';
import { serverRoot } from '../config';
import * as DatabaseUtils from '../lib/DatabaseUtils';

export let receiveMessage = message => async (dispatch, getState) => {
  let contactIds = getState().contacts.map(c => c.id);

  if (contactIds.indexOf(message.senderId) === -1) {
    return;
  }

  await DatabaseUtils.storeMessage(message);

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

export let sendEnqueuedMessages = () => async (dispatch, getState) => {
  let filterFn = anyPass([propEq('state', 'failed')]);
  let messages = filter(filterFn, getState().messages);
  return sendMessages(messages)(dispatch, getState);
};

export let sendMessage = message => (dispatch, getState) => {
  sendMessages([message])(dispatch, getState);
};

export let sendMessages = messages => async (dispatch, getState) => {
  await messages.map(m => DatabaseUtils.storeMessage(m));

  dispatch({
    type: 'sendMessages',
    state: 'enqueued',
    messages
  });
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
