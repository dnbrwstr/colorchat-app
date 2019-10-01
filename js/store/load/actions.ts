import {LOAD_COMPLETE} from './types';
import {AppState} from '../createStore';

export const loadComplete = (data: Partial<AppState>) => {
  return {
    type: LOAD_COMPLETE,
    data,
  };
};
