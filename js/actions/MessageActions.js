import { merge, find, propEq, anyPass, filter } from 'ramda';
import { postJSON } from '../lib/RequestHelpers';
import { serverRoot } from '../config';
import { sendMessage as sendMessageOverSocket } from '../lib/SocketUtils';

export let generateClientId = () =>
  Math.floor(Math.random() * Math.pow(10, 10)).toString(16);

export let receiveMessage = message => {
  return {
    type: 'receiveMessage',
    message: message
  }
};

export let receivePendingMessages = messages => {
  return {
    type: 'receivePendingMessages',
    messages: messages
  }
};

export let sendEnqueuedMessages = () => async (dispatch, getState) => {
  let filterFn = anyPass([propEq('state', 'failed')]);
  let messages = filter(filterFn, getState().messages);
  return messages.map(m => sendMessage(m)(dispatch, getState));
}

export let sendMessage = message => async (dispatch, getState) => {
  let senderId = getState().user.id;
  let clientId = generateClientId();
  let clientTimestamp = new Date();
  let tempMessage;

  // Check if we're resending
  if (!message.clientId) {
    tempMessage = merge(message, {
      clientId,
      clientTimestamp,
      senderId
    });
  } else {
    tempMessage = message;
  }

  dispatch({
    type: 'sendMessage',
    state: 'started',
    message: tempMessage
  });

  let messageTimeout = setTimeout(function () {
    dispatch({
      type: 'sendMessage',
      state: 'failed',
      message: tempMessage,
      error: 'Sending timed out'
    });
  }, 6000);

  try {
    sendMessageOverSocket(tempMessage, function (data) {
      clearTimeout(messageTimeout);

      dispatch({
        type: 'sendMessage',
        state: 'complete',
        message: merge(tempMessage, data)
      });
    });
  } catch (e) {
    clearTimeout(messageTimeout);

    dispatch({
      type: 'sendMessage',
      state: 'failed',
      message: tempMessage,
      error: e.toString()
    });
  }
};
