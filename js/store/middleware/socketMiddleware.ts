import {MiddlewareAPI, Dispatch, AnyAction, Action, compose} from 'redux';
import {AppState as StoreState} from '../createStore';
import {receiveMessage} from '../messages/actions';
import {receiveComposeEvent} from '../conversations/actions';
import {
  RawMessageData,
  Message,
  SEND_MESSAGES,
  SendMessagesAction,
  SendMessagesBaseAction,
} from '../messages/types';
import {ComposeEventData} from '../conversations/types';
import {ThunkDispatch} from 'redux-thunk';
import {authError, socketDisconnected} from '../ui/actions';
import {dispatchAsyncActions} from '../../lib/AsyncAction';
import MessageClient, {MessageEvent} from '../../lib/MessageClient';

const COMPOSE_EVENT_INTERVAL = 1500;

interface SocketMiddlewareState {
  enqueuedMessages: Message[];
  composingMessages: Message[];
  token: string | undefined;
}

const selector = (state: StoreState): SocketMiddlewareState => {
  return {
    enqueuedMessages: state.messages.enqueued,
    composingMessages: state.messages.working,
    token: state.user.token,
  };
};

const socketMiddleware = (
  store: MiddlewareAPI<ThunkDispatch<StoreState, undefined, Action<string>>>,
) => {
  let state: SocketMiddlewareState;
  let client: MessageClient = new MessageClient();

  client.on(MessageEvent.Connect, () => {
    sendEnqueuedMessages();
  });

  client.on(MessageEvent.Message, (data: RawMessageData) => {
    store.dispatch(receiveMessage(data));
  });

  client.on(MessageEvent.Compose, (data: ComposeEventData) => {
    store.dispatch(receiveComposeEvent(data));
  });

  client.on(MessageEvent.ConnectError, (e: string) => {
    store.dispatch(socketDisconnected(e));
  });

  client.on(MessageEvent.AuthError, (e: string) => {
    store.dispatch(authError());
  });

  const sendEnqueuedMessages = () => {
    const messages = state.enqueuedMessages;
    if (!messages.length) return;
    const operation = client.sendMessages(messages);
    const baseAction: SendMessagesBaseAction = {
      type: SEND_MESSAGES,
      messages,
    };
    dispatchAsyncActions<SendMessagesAction>(
      baseAction,
      operation,
      store.dispatch,
    );
  };

  const sendComposeEvents = function(composingMessages: Message[]) {
    composingMessages.forEach(m => {
      client.sendComposeEvents(composingMessages);
    });
  };
  setInterval(sendComposeEvents, COMPOSE_EVENT_INTERVAL);

  return (next: Dispatch) => (action: AnyAction) => {
    next(action);
    state = selector(store.getState());
    client.setToken(state.token);
    if (client.isConnected()) sendEnqueuedMessages();
  };
};

export default socketMiddleware;