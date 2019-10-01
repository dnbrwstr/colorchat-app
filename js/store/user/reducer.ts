import createRoutingReducer, {CaseReducer} from '../createRoutingReducer';
import {
  UserState,
  UPDATE_USER_INFO,
  BLOCK_USER,
  UNBLOCK_USER,
  LOAD_BLOCKED_USERS,
  LOGOUT,
  LogoutAction,
  LoadBlockedUsersAction,
  UnblockUserAction,
  BlockUserAction,
  UpdateUserInfoAction,
  LOAD_USER_INFO,
  LoadUserInfoAction,
} from './types';
import {SAVE_DEVICE_TOKEN, SaveDeviceTokenAction} from '../notifications/types';
import {AsyncActionState} from '../../lib/AsyncAction';
import {
  SUBMIT_CONFIRMATION_CODE,
  SubmitConfirmationCodeAction,
} from '../signup/types';

const initialState: UserState = {};

const handlers: {[key: string]: CaseReducer<UserState, any>} = {
  authError: (state, action) => {
    if (state) {
      return {
        ...state,
        token: undefined,
      };
    } else return state;
  },

  [SUBMIT_CONFIRMATION_CODE]: (state, action: SubmitConfirmationCodeAction) => {
    if (action.state == AsyncActionState.complete) {
      return {
        ...state,
        ...action.result.user,
      };
    } else {
      return state;
    }
  },

  [SAVE_DEVICE_TOKEN]: (state, action: SaveDeviceTokenAction) => {
    return {
      ...state,
      deviceToken: action.deviceToken,
      deviceTokenSaved: action.state === AsyncActionState.complete,
    };
  },

  [LOAD_USER_INFO]: (state, action: LoadUserInfoAction) => {
    if (action.state === AsyncActionState.complete) {
      return {
        ...state,
        ...action.result,
      };
    } else {
      return state;
    }
  },

  [UPDATE_USER_INFO]: (state, action: UpdateUserInfoAction) => {
    return {
      ...state,
      ...action.data,
    };
  },

  [BLOCK_USER]: (state, action: BlockUserAction) => {
    if (action.state === AsyncActionState.complete) {
      return {
        ...state,
        ...action.result,
      };
    } else {
      return state;
    }
  },

  [UNBLOCK_USER]: (state, action: UnblockUserAction) => {
    if (action.state === AsyncActionState.complete) {
      return {
        ...state,
        ...action.result,
      };
    } else {
      return state;
    }
  },

  [LOAD_BLOCKED_USERS]: (state, action: LoadBlockedUsersAction) => {
    if (action.state === AsyncActionState.complete) {
      return {
        ...state,
        ...action.result,
      };
    } else {
      return state;
    }
  },

  [LOGOUT]: (state, action: LogoutAction) => {
    return initialState;
  },
};

export default createRoutingReducer<UserState>({
  key: 'user',
  handlers,
  initialState,
});
