import { merge, find, propEq, anyPass, filter } from 'ramda';
import { InteractionManager } from 'react-native';
import { postJSON } from '../lib/RequestHelpers';
import { serverRoot } from '../config';

export let receiveMessages = messages => (dispatch, getState) => {
  let contactIds = getState().contacts.map(c => c.id);
  let allowedMessages = messages.filter(m => contactIds.indexOf(m.senderId) !== -1);

  dispatch({
    type: 'receiveMessages',
    messages: allowedMessages
  });
};

export let startComposingMessage = message => {
  return {
    type: 'startComposingMessage',
    message
  };
};

export let cancelComposingMessage = () => {
  return {
    type: 'cancelComposingMessage'
  };
};

export let destroyWorkingMessage = () => {
  return {
    type: 'destroyWorkingMessage'
  };
};

export let updateWorkingMessage = messageData => (dispatch, getState) => {
  let data = merge(messageData, {
    senderId: getState().user.id,
  });

  dispatch({
    type: 'updateWorkingMessage',
    messageData: data
  });
};

export let sendWorkingMessage = () => {
  return {
    type: 'sendWorkingMessage'
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
    messages: messages
  });
};

export let markMessageStale = message => {
  return {
    type: 'markMessageStale',
    message: message
  }
};

export let toggleMessageExpansion = message => {
  return {
    type: 'toggleMessageExpansion',
    message
  }
};
