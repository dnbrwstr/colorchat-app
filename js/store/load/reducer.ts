import createRoutingReducer, {ActionHandlerMap} from '../createRoutingReducer';
import {
  LOAD_KEY,
  LoadState,
  LoadActionTypes,
  LoadCompleteAction,
  LOAD_COMPLETE,
} from './types';

const initialState: LoadState = {
  complete: false,
};

const handlers: ActionHandlerMap<LoadState> = {
  [LOAD_COMPLETE](state, action: LoadCompleteAction) {
    return {
      ...state,
      complete: true
    }
  },
};

export default createRoutingReducer<LoadState, LoadActionTypes>({
  key: LOAD_KEY,
  handlers,
  initialState,
});
