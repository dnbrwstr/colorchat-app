import io from 'socket.io-client/socket.io';
import React from 'react-native';
import { serverRoot } from '../config';
import createService from '../lib/createService';
import { socketServiceSelector } from './Selectors';
import { receiveMessages, sendEnqueuedMessages } from '../actions/MessageActions';

let client, store, token;
let active = false;

let { InteractionManager } = React;

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
    if (this.props.token) {
      this.client = this.createClient();
    }
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

    client.on('messagedata', (data, cb) => {
      this.props.dispatch(receiveMessages(data));
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
    let hasMessages = !!this.props.messages.length;

    if (this.active && hasMessages) {
      this.send(this.props.messages);
    } else if (!this.active && hasMessages) {
      this.props.dispatch({
        type: 'sendMessages',
        state: 'failed',
        messages: this.props.messages,
        error: 'Unable to connect to server'
      })
    }
  },

  send: function (data) {
    let { dispatch } = this.props;
    let messageData;
    // Dispatch happens synchronously, so if we're sending
    // a number of messages we have to mark them all 'started'
    // at the same time to avoid duplicate sends
    if (data instanceof Array) {
      messageData = data;
    } else {
      messageData = [data];
    }

    dispatch({
      type: 'sendMessages',
      state: 'started',
      messages: messageData
    });

    let messageTimeout = setTimeout(function () {
      dispatch({
        type: 'sendMessages',
        state: 'failed',
        messages: messageData,
        error: 'Sending timed out'
      });
    }, 6000);

    this.client.emit('messagedata', messageData, (sentMessages) => {
      clearTimeout(messageTimeout);

      InteractionManager.runAfterInteractions(() => {
        sentMessages.forEach((m, i) => m.clientId = messageData[i].clientId);

        dispatch({
          type: 'sendMessages',
          state: 'complete',
          messages: sentMessages
        });
      });
    });
  }
};

export default createSocketService = store => {
  return createService(store)(socketServiceBase, socketServiceSelector);
};
