import io from 'socket.io-client/socket.io.js';
import { serverRoot } from '../config';
import { receiveMessage, receivePendingMessages, sendEnqueuedMessages } from '../actions/MessageActions';

let client, store, token;
let active = false;

let onStoreUpdate = getState => {
  let newToken = store.getState().user.token;
  if (newToken === token) return;
  token = newToken;

  if (client) {
    client.disconnect();
  }

  if (token) {
    client = createSocketClient();
  } else {
    store.dispatch({
      type: 'socketDisconnected'
    });
  }
}

let createSocketClient = () => {
  let options = {
    transports: ['websocket'],
    'force new connection': true,
    query: 'token=' + token
  }

  let _client = io(serverRoot, options);

  _client.on('connect', (data) => {
    active = true;

    store.dispatch({
      type: 'socketConnected'
    });

    store.dispatch(sendEnqueuedMessages());
  });

  _client.on('message', (data, cb) => {
    store.dispatch(receiveMessage(data));
    if (cb) cb();
  });

  _client.on('pending', (data, cb) => {
    store.dispatch(receivePendingMessages(data));
    if (cb) cb();
  });

  _client.on('connect_error', e => {
    active = false;

    store.dispatch({
      type: 'connectivityError',
      error: e
    });
  });

  _client.on('error', e => {
    let authErrors = [
      'Missing token',
      'Invalid token',
      'Invalid session'
    ];

    if (authErrors.indexOf(e) !== -1) {
      store.dispatch({
        type: 'authError'
      });
    }
  });

  return _client;
};

export let init = _store => {
  if (client) {
    throw new Error('Socket already initialized');
  }

  store = _store;
  store.subscribe(onStoreUpdate);
  onStoreUpdate();
};

export let sendMessage = (messageData, cb) => {
  if (!client) throw new Error('Client not initialized');
  if (!active) throw new Error('Not connected to server');
  client.emit('message', messageData, cb);
}
