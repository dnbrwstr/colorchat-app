import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
  Reducer,
  Middleware,
  AnyAction,
} from 'redux';
import thunkMiddleware, {ThunkMiddleware, ThunkAction} from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import saveStateMiddleware from './middleware/saveStateMiddleware';
import navigationMiddleware from './middleware/navigationMiddleware';
import notificationMiddleware from './middleware/notificationMiddleware';
import {reducers} from './reducers';
import {Selector} from 'reselect';
import {MessageAction} from './messages/types';
import {NotificationAction} from './notifications/types';
import {LoadActionTypes} from './load/types';
import {ConversationActionTypes} from './conversations/types';
import {ContactsActionTypes} from './contacts/types';

const middleware = [
  thunkMiddleware as ThunkMiddleware<AppState, AnyAction>,
  saveStateMiddleware,
  navigationMiddleware,
  notificationMiddleware,
];

const reducer = combineReducers(reducers);

export const STORE_READY = 'ready';
export type StoreReadyAction = {
  type: typeof STORE_READY;
};
export type StoreActionTypes = StoreReadyAction;
export type AppState = ReturnType<typeof reducer>;
export type ThunkResult<R> = ThunkAction<R, AppState, undefined, AnyAction>;
export type AppSelector = Selector<AppState, any>;
export type AppActionTypes =
  | MessageAction
  | NotificationAction
  | LoadActionTypes
  | ConversationActionTypes
  | ContactsActionTypes
  | StoreActionTypes;

export const createStoreReadyAction = () => ({
  type: STORE_READY,
});

const createStore = (reducer: Reducer, middleware: Middleware[]) =>
  composeWithDevTools(applyMiddleware(...middleware))(reduxCreateStore)(
    reducer,
  );

const finalCreateStore = () => {
  const store = createStore(reducer, middleware);
  store.dispatch(createStoreReadyAction());
  return store;
};

export default finalCreateStore;
