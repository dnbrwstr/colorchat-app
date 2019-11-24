import createRoutingReducer, {CaseHandlerMap} from '../createRoutingReducer';
import {CHANGE_THEME, ChangeThemeAction, ThemeState} from './types';
import themes from '../../style/themes';
import {LOAD_COMPLETE, LoadCompleteAction} from '../load/types';

const initialState: ThemeState = themes.cream;

const handlers: CaseHandlerMap<ThemeState> = {
  [LOAD_COMPLETE]: function(state, action: LoadCompleteAction) {
    return action.data.theme ? action.data.theme : initialState;
  },

  [CHANGE_THEME]: function(state, action: ChangeThemeAction) {
    return action.theme;
  },
};

export default createRoutingReducer({
  handlers,
  initialState,
});
