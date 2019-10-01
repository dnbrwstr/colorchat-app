import {MiddlewareAPI, Dispatch, AnyAction, Action} from 'redux';
import config from '../../config';
import {loadComplete} from '../load/actions';
import {STORE_READY, AppActionTypes, AppState} from '../createStore';
import {loadState, saveState} from '../../lib/StateStorageUtils';
import {LOAD_COMPLETE} from '../load/types';

let {saveState: shouldSaveState} = config;

const saveStateMiddleware = (store: MiddlewareAPI<Dispatch, AppState>) => (
  next: Dispatch,
) => async (action: AppActionTypes) => {
  const result = next(action);
  const nextState = store.getState();

  if (action.type === STORE_READY) {
    console.log('Loading starte');
    const state = await loadState();
    console.log('State is', state);
    store.dispatch(loadComplete(state));
  } else if (action.type === LOAD_COMPLETE) {
    for (let key in action.data) {
      const appStateKey = key as keyof AppState;
      if (action.data[appStateKey]) {
        nextState[appStateKey] = action.data[appStateKey];
      }
    }
  } else if (shouldSaveState && nextState) {
    saveState(nextState);
  }

  return result;
};

export default saveStateMiddleware;
