import io from 'socket.io-client/socket.io';
import React from 'react-native';
import { difference } from 'ramda';
import { serverRoot } from '../config';
import createService from '../lib/createService';
import { socketServiceSelector } from './Selectors';
import { receiveMessage, sendMessages, sendEnqueuedMessages } from '../actions/MessageActions';
import { receiveComposeEvent, resetComposeEvents } from '../actions/ConversationActions';

let client, store, token;
let active = false;

const MESSAGE_EVENT = 'messagedata';
const COMPOSE_EVENT = 'composeevent';
const COMPOSE_EVENT_INTERVAL = 1500;

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
    this.props.dispatch(resetComposeEvents());
    setInterval(this.updateComposeEvents, COMPOSE_EVENT_INTERVAL);

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

  updateComposeEvents: function () {
    this.props.composingMessages.forEach(m => {
      this.client.emit(COMPOSE_EVENT, { recipientId: m.recipientId });
    });
  },

  createClient: function () {
    let client = io(serverRoot, getSocketOptions(this.props.token));

    client.on('connect', () => {
      this.active = true;
      this.sendEnqueuedMessages();
    });

    client.on(MESSAGE_EVENT, (data, cb) => {
      this.props.dispatch(receiveMessage(data));
      cb && cb();
    });

    client.on(COMPOSE_EVENT, (data, cb) => {
      this.props.dispatch(receiveComposeEvent(data));
      cb && cb();
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
    let messages = this.props.enqueuedMessages;
    let hasMessages = !!messages.length;

    if (this.active && hasMessages) {
      this.sendMessage(messages);
    } else if (!this.active && hasMessages) {
      this.props.dispatch(sendMessages(messages, 'failed', {
        error: 'Unable to connect to server'
      }));
    }
  },

  sendMessage: function (data) {
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

    dispatch(sendMessages(messageData, 'started'));

    let messageTimeout = setTimeout(function () {
      dispatch(sendMessages(messageData, 'failed', {
        error: 'Sending timed out'
      }));
    }, 6000);

    this.client.emit(MESSAGE_EVENT, messageData, (sentMessages) => {
      clearTimeout(messageTimeout);

      InteractionManager.runAfterInteractions(() => {
        dispatch(sendMessages(messageData, 'complete', {
          responseMessages: sentMessages
        }));
      });
    });
  }
};

export default createSocketService = store => {
  return createService(store)(socketServiceBase, socketServiceSelector);
};
