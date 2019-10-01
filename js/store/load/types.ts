import {AppState} from '../createStore';

export const LOAD_KEY = 'load';

export interface LoadState {
  complete: boolean;
}

export const LOAD_COMPLETE = 'loadComplete';

export interface LoadCompleteAction {
  type: typeof LOAD_COMPLETE;
  data: Partial<AppState>;
}

export type LoadActionTypes = LoadCompleteAction;
