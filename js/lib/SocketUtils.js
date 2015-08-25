import io from 'socket.io-client/socket.io.js';
import { serverRoot } from '../config';
import { receiveMessage, receivePendingMessages } from '../actions/MessageActions';

let client;

let createSocketClient = (authToken) => {
  let options = {
    transports: ['websocket'],
    'force new connection': true,
    query: 'token=' + authToken
  }

  return io(serverRoot, options);
};

export let init = (authToken, dispatch) => {
  if (client) {
    throw new Error('Socket already initialized');
  }

  client = createSocketClient(authToken);

  client.on('message', (data, cb) => {
    dispatch(receiveMessage(data));
    cb();
  });

  client.on('pending', (data, cb) => {
    dispatch(receivePendingMessages(data));
    cb();
  });
};

export let sendMessage = (messageData, cb) =>
  client.emit('message', messageData, cb);