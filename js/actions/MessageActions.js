import { merge, find, propEq, anyPass, filter } from 'ramda';
import { postJSON } from '../lib/RequestHelpers';
import { serverRoot } from '../config';

export let generateClientId = () =>
  Math.floor(Math.random() * Math.pow(10, 10)).toString(16);

export let receiveMessages = messages => (dispatch, getState) => {
  let contactIds = getState().contacts.map(c => c.id);
  let allowedMessages = messages.filter(m => contactIds.indexOf(m.senderId) !== -1);

  dispatch({
    type: 'receiveMessages',
    messages: allowedMessages
  });
};

export let sendEnqueuedMessages = () => async (dispatch, getState) => {
  let filterFn = anyPass([propEq('state', 'failed')]);
  let messages = filter(filterFn, getState().messages);
  return sendMessages(messages)(dispatch, getState);
}

export let sendMessage = message => (dispatch, getState) =>
  sendMessages([message])(dispatch, getState);

export let sendMessages = messages => async (dispatch, getState) => {
  let messageData = messages.map(m => {
    if (m.clientId) return m;

    return merge(m, {
      clientId: generateClientId(),
      clientTimestamp: new Date(),
      fresh: true,
      senderId: getState().user.id
    });
  });

  dispatch({
    type: 'sendMessages',
    state: 'enqueued',
    messages: messageData
  });
};

export let markMessageStale = message => ({
  type: 'markMessageStale',
  message: message
});
