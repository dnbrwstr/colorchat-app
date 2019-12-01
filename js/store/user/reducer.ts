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
import {LOAD_COMPLETE, LoadCompleteAction} from '../load/types';
import {AUTH_ERROR} from '../ui/types';

const initialState: UserState = null;

const handlers: {[key: string]: CaseReducer<UserState, any>} = {
  [LOAD_COMPLETE]: (state, action: LoadCompleteAction) => {
    const startState = action.data.user || initialState;
    return startState;
  },

  [AUTH_ERROR]: (state, action) => {
    return initialState;
  },

  [SUBMIT_CONFIRMATION_CODE]: (state, action: SubmitConfirmationCodeAction) => {
    if (action.state == AsyncActionState.Complete) {
      return {
        ...state,
        ...action.result.user,
      };
    } else {
      return state;
    }
  },

  [SAVE_DEVICE_TOKEN]: (state, action: SaveDeviceTokenAction) => {
    if (!state) return null;
    return {
      ...state,
      deviceToken: action.deviceToken,
      deviceTokenSaved: action.state === AsyncActionState.Complete,
    };
  },

  [LOAD_USER_INFO]: (state, action: LoadUserInfoAction) => {
    if (!state) return null;

    if (action.state === AsyncActionState.Complete) {
      return {
        ...state,
        ...action.result,
      };
    } else {
      return state;
    }
  },

  [UPDATE_USER_INFO]: (state, action: UpdateUserInfoAction) => {
    if (!state) return null;
    return {
      ...state,
      ...action.data,
    };
  },

  [BLOCK_USER]: (state, action: BlockUserAction) => {
    if (!state) return null;
    if (action.state === AsyncActionState.Complete) {
      return {
        ...state,
        ...action.result,
      };
    } else {
      return state;
    }
  },

  [UNBLOCK_USER]: (state, action: UnblockUserAction) => {
    if (!state) return null;
    if (action.state === AsyncActionState.Complete) {
      return {
        ...state,
        ...action.result,
      };
    } else {
      return state;
    }
  },

  [LOAD_BLOCKED_USERS]: (state, action: LoadBlockedUsersAction) => {
    if (!state) return null;
    if (action.state === AsyncActionState.Complete) {
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
  handlers,
  initialState,
});
