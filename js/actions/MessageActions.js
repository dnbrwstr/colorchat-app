import { merge, find, propEq, anyPass, filter } from 'ramda';
import { postJSON } from '../lib/RequestHelpers';
import { serverRoot } from '../config';

export let generateClientId = () =>
  Math.floor(Math.random() * Math.pow(10, 10)).toString(16);

export let receiveMessages = messages => {
  return {
    type: 'receiveMessages',
    messages: messages
  }
};

export let sendEnqueuedMessages = () => async (dispatch, getState) => {
  let filterFn = anyPass([propEq('state', 'failed')]);
  let messages = filter(filterFn, getState().messages);
  return sendMessages(messages)(dispatch, getState);
}

export let sendMessage = message => (dispatch, getState) =>
  sendMessages([message])(dispatch, getState);

export let sendMessages = messages => async (dispatch, getState) => {
  let senderId = getState().user.id;
  let clientTimestamp = new Date();

  let messageData = messages.map(m => {
    if (!m.clientId) {
      return merge(m, {
        clientId: generateClientId(),
        clientTimestamp,
        senderId
      });
    } else {
      return m;
    }
  });

  dispatch({
    type: 'sendMessages',
    state: 'enqueued',
    messages: messageData
  });
};
