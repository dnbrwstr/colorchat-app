import io from 'socket.io-client';
import {convertToRelativeSize} from '../lib/MessageUtils';
import config from '../config';
import {RawMessageData, Message} from '../store/messages/types';
import {ComposeEventData} from '../store/conversations/types';
import EventEmitter from 'eventemitter3';

const {serverRoot} = config;

const authErrors = ['Missing token', 'Invalid token', 'Invalid session'];

export enum MessageEvent {
  AuthError = 'authError',
  Message = 'messagedata',
  Compose = 'composeevent',
  Connect = 'connect',
  ConnectError = 'connect_error',
  Error = 'error',
}

class MessageClient {
  emitter: EventEmitter;
  token?: string;
  socket?: SocketIOClient.Socket;

  constructor() {
    this.emitter = new EventEmitter();
  }

  setToken(token?: string) {
    if (token === this.token) return;
    if (this.socket) {
      // Reset client if token has changed
      this.socket.disconnect();
      this.socket = undefined;
    }
    if (token) {
      // Recreate client if we have a token
      this.socket = this.createSocket();
    } else {
      // Otherwise die
      this.emit(MessageEvent.ConnectError, 'No user token');
    }
  }

  createSocket() {
    if (!this.token) return;

    const client = io(serverRoot, {
      transports: ['websocket'],
      forceNew: true,
      query: `token=${this.token}`,
      timeout: 30000,
    });

    client.on(MessageEvent.Connect, () => {
      this.emit(MessageEvent.Connect);
    });

    client.on(MessageEvent.Message, (data: RawMessageData, ack: Function) => {
      this.emit(MessageEvent.Message, data);
      ack();
    });

    client.on(MessageEvent.Compose, (data: ComposeEventData, ack: Function) => {
      this.emit(MessageEvent.Compose, data);
      ack();
    });

    client.on(MessageEvent.ConnectError, (e: string) => {
      this.emit(MessageEvent.ConnectError, e);
    });

    client.on(MessageEvent.Error, (e: string) => {
      if (authErrors.indexOf(e) !== -1) {
        this.emit(MessageEvent.Error);
      }
    });

    return client;
  }

  sendMessages = (messages: Message[]) =>
    new Promise<RawMessageData[]>((resolve, reject) => {
      if (!this.isConnected()) {
        reject(new Error('Unable to connect to server'));
        return;
      }

      const onTimeout = () => {
        reject(new Error('Sending timed out'));
      };
      const messageTimeout = setTimeout(onTimeout, 6000);

      const onSuccess = (sentMessages: RawMessageData[]) => {
        clearTimeout(messageTimeout);
        resolve(sentMessages);
      };

      this.socket &&
        this.socket.emit(
          MessageEvent.Message,
          messages.map(convertToRelativeSize),
          onSuccess,
        );
    });

  sendComposeEvents(composingMessages: Message[]) {
    composingMessages.forEach(m => {
      this.socket &&
        this.socket.emit(MessageEvent.Compose, {
          recipientId: m.recipientId,
        });
    });
  }

  isConnected() {
    return !!(this.socket && this.socket.connected);
  }

  on(eventName: string, cb: (...args: any[]) => void) {
    this.emitter.on(eventName, cb);
  }

  emit(eventName: string, data?: any) {
    this.emitter.emit(eventName, data);
  }
}

export default MessageClient;
