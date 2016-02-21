import React from 'react-native';
import { merge, find, propEq, anyPass, filter, map, zipWith } from 'ramda';
import { InteractionManager } from 'react-native';
import { postJSON } from '../lib/RequestHelpers';
import config from '../config';
import * as DatabaseUtils from '../lib/DatabaseUtils';

let { serverRoot } = config;

export let receiveMessage = message => async (dispatch, getState) => {
  let { navigation, ui } = getState();

  // Treat incoming messages as fresh by default
  message.state = 'fresh';

  await DatabaseUtils.storeMessage(message);

  let inCurrentConversation =
    navigation.route.title === 'conversation' &&
    navigation.route.data.contactId === message.senderId;

  dispatch({
    type: 'receiveMessage',
    inCurrentConversation,
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
