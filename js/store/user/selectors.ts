import {AppState} from '../createStore';

export const selectUserToken = (state: AppState) => {
  if (state.user) return state.user.token;
};
