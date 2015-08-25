import { merge } from 'ramda';
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

export let sendMessage = message => async (dispatch, getState) => {
  let senderId = getState().user.id;
  let clientId = generateClientId();
  let clientTimestamp = new Date();

  let tempMessage = merge(message, {
    clientId,
    clientTimestamp,
    senderId
  });

  dispatch({
    type: 'sendMessage',
    state: 'started',
    message: tempMessage
  });

  try {
    sendMessageOverSocket(tempMessage, function (data) {
      dispatch({
        type: 'sendMessage',
        state: 'complete',
        message: merge(tempMessage, data)
      });
    });
  } catch (e) {
    dispatch({
      type: 'sendMessage',
      state: 'failed',
      message: tempMessage,
      error: e.toString()
    });
  }
};
