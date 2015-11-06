import { merge, find, propEq, anyPass, filter } from 'ramda';
import { InteractionManager } from 'react-native';
import { postJSON } from '../lib/RequestHelpers';
import { serverRoot } from '../config';

export let receiveMessage = message => (dispatch, getState) => {
  let contactIds = getState().contacts.map(c => c.id);

  if (contactIds.indexOf(message.senderId) === -1) {
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

export let sendEnqueuedMessages = () => async (dispatch, getState) => {
  let filterFn = anyPass([propEq('state', 'failed')]);
  let messages = filter(filterFn, getState().messages);
  return sendMessages(messages)(dispatch, getState);
};

export let sendMessage = message => (dispatch, getState) => {
  sendMessages([message])(dispatch, getState);
};

export let sendMessages = messages => async (dispatch, getState) => {
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
