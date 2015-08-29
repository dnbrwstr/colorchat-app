import io from 'socket.io-client/socket.io';
import { merge } from 'ramda';
import { serverRoot } from '../config';
import createService from '../lib/createService';
import { socketServiceSelector } from './Selectors';
import { receiveMessage, receivePendingMessages, sendEnqueuedMessages } from '../actions/MessageActions';

let client, store, token;
let active = false;

let getSocketOptions = token => ({
  transports: ['websocket'],
  'force new connection': true,
  query: 'token=' + token
});

let authErrors = [
  'Missing token',
  'Invalid token',
  'Invalid session'
];

let socketServiceBase = {
  onDidInitialize: function () {
    this.client = this.createClient();
  },

  onDidUpdate: function (prevProps) {
    if (prevProps.token === this.props.token) {
      return this.sendEnqueuedMessages();
    };

    if (this.client) {
      this.client.disconnect();
      this.client = null;
      this.connected = false;
    }

    if (this.props.token) {
      this.client = this.createClient();
    } else {
      this.props.dispatch({
        type: 'socketDisconnected'
      });
    }
  },

  createClient: function () {
    let client = io(serverRoot, getSocketOptions(this.props.token));

    client.on('connect', () => {
      this.active = true;
      this.sendEnqueuedMessages();
    });

    client.on('message', (data, cb) => {
      this.props.dispatch(receiveMessage(data));
      if (cb) cb();
    });

    client.on('pending', (data, cb) => {
      this.props.dispatch(receivePendingMessages(data));
      if (cb) cb();
    });

    client.on('connect_error', e => {
      this.active = false;

      this.props.dispatch({
        type: 'socketDisconnected',
        error: e
      });
    });

    client.on('error', e => {
      if (authErrors.indexOf(e) !== -1) {
        this.props.dispatch({
          type: 'authError'
        });
      }
    });

    return client;
  },

  sendEnqueuedMessages: function () {
    if (this.active && this.props.messages.length) {
      this.send(this.props.messages);
    }
  },

  send: function (data) {
    let toSend;
    // Dispatch happens synchronously, so if we're sending
    // a number of messages we have to mark them all 'started'
    // at the same time to avoid duplicate sends
    if (data instanceof Array) {
      this.props.dispatch({
        type: 'sendMessageBatch',
        state: 'started',
        messages: data
      });

      toSend = data;
    } else {
      this.props.dispatch({
        type: 'sendMessage',
        state: 'started',
        message: data
      });

      toSend = [data];
    }

    toSend.forEach(m => {
      let messageTimeout = setTimeout(function () {
        dispatch({
          type: 'sendMessage',
          state: 'failed',
          message: m,
          error: 'Sending timed out'
        });
      }, 6000);

      this.client.emit('message', m, (message) => {
        clearTimeout(messageTimeout);

        this.props.dispatch({
          type: 'sendMessage',
          state: 'complete',
          message: merge(m, message)
        });
      });
    });
  }
};

export default createSocketService = store => {
  return createService(store)(socketServiceBase, socketServiceSelector);
};
