import {MiddlewareAPI, Dispatch} from 'redux';
import config from '../../config';
import {loadComplete} from '../load/actions';
import {STORE_READY, AppActionTypes, AppState} from '../createStore';
import {loadState, saveState} from '../../lib/StateStorageUtils';

let {saveState: shouldSaveState} = config;

const saveStateMiddleware = (store: MiddlewareAPI<Dispatch, AppState>) => (
  next: Dispatch,
) => {
  const load = async () => {
    const state = await loadState();
    console.log(state.conversations);
    store.dispatch(loadComplete(state));
  };

  return (action: AppActionTypes) => {
    const result = next(action);
    const nextState = store.getState();

    if (action.type === STORE_READY) {
      load();
    } else if (shouldSaveState && nextState) {
      saveState(nextState);
    }

    return result;
  };
};

export default saveStateMiddleware;
