import createRoutingReducer, {CaseHandlerMap} from '../createRoutingReducer';
import {SignupState, UpdateDataAction, UPDATE_DATA} from './types';
import {LOGOUT, LogoutAction} from '../user/types';

const initialState: SignupState = {
  country: 'United States',
  countryCode: '1',
  baseNumber: '',
  confirmationCode: '',
};

const handlers: CaseHandlerMap<SignupState> = {
  [UPDATE_DATA]: (state, action: UpdateDataAction) => ({
    ...state,
    ...action.data,
  }),

  [LOGOUT]: (state, action: LogoutAction) => {
    return initialState;
  },
};

export default createRoutingReducer({
  key: 'signup',
  handlers,
  initialState,
});
