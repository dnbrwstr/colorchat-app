import createRoutingReducer, {CaseHandlerMap} from '../createRoutingReducer';
import Style from '../../style';
import {
  UiState,
  CHANGE_APP_STATE,
  CHANGE_THEME,
  CHANGE_NETWORK,
  UPDATE_CONVERSATION_UI,
  UpdateConversationUiAction,
  ChangeThemeAction,
  ChangeAppStateAction,
  ChangeNetworkAction,
} from './types';
import {NetInfoStateType} from '@react-native-community/netinfo';
import {
  REGISTER_PHONE_NUMBER,
  RegisterPhoneNumberAction,
  SUBMIT_CONFIRMATION_CODE,
  SubmitConfirmationCodeAction,
  CLEAR_CONFIRM_CODE_ERROR,
  ClearConfirmCodeErrorAction,
  CLEAR_SIGNUP_ERROR,
} from '../signup/types';
import {IMPORT_CONTACTS, ImportContactsAction} from '../contacts/types';
import {
  START_COMPOSING_MESSAGE,
  StartComposingMessageAction,
  CANCEL_COMPOSING_MESSAGE,
  CancelComposingMessageAction,
} from '../messages/types';
import {
  AsyncActionState,
  SimpleAsyncAction,
  AsyncActionFailedResult,
} from '../../lib/AsyncAction';

const initialState: UiState = {
  appState: 'active',
  network: NetInfoStateType.unknown,
  signup: {
    loading: false,
    error: null,
  },
  confirmationCode: {
    loading: false,
    error: null,
  },
  countryPicker: {},
  contacts: {
    imported: false,
    importInProgress: false,
    importError: null,
    shouldRefresh: true,
  },
  inbox: {},
  conversation: undefined,
  theme: Style.themes.cream,
};

const getSignupScreenTransformation = <A extends SimpleAsyncAction>(
  action: A,
) =>
  ({
    [AsyncActionState.Started]: {
      loading: true,
    },
    [AsyncActionState.Complete]: {
      loading: false,
      error: null,
    },
    [AsyncActionState.Failed]: {
      loading: false,
      error:
        (action as AsyncActionFailedResult).error || 'Network request failed',
    },
  }[action.state]);

const handlers: CaseHandlerMap<UiState> = {
  [REGISTER_PHONE_NUMBER]: function(state, action: RegisterPhoneNumberAction) {
    console.log('REfister saction', action);
    return {
      ...state,
      signup: {
        ...state.signup,
        ...getSignupScreenTransformation(action),
      },
    };
  },

  [CLEAR_SIGNUP_ERROR]: function(state, action) {
    return {
      ...state,
      signup: {
        ...state.signup,
        error: null,
      },
    };
  },

  [SUBMIT_CONFIRMATION_CODE]: function(
    state,
    action: SubmitConfirmationCodeAction,
  ) {
    return {
      ...state,
      confirmationCode: {
        ...state.confirmationCode,
        ...getSignupScreenTransformation(action),
      },
    };
  },

  [CLEAR_CONFIRM_CODE_ERROR]: function(
    state,
    action: ClearConfirmCodeErrorAction,
  ) {
    return {
      ...state,
      confirmationCode: {
        ...state.confirmationCode,
        error: null,
      },
    };
  },

  [IMPORT_CONTACTS]: function(state, action: ImportContactsAction) {
    const transform = {
      [AsyncActionState.Started]: {
        importInProgress: true,
      },
      [AsyncActionState.Complete]: {
        imported: true,
        importInProgress: false,
        importError: null,
        shouldRefresh: false,
      },
      [AsyncActionState.Failed]: {
        importInProgress: false,
        importError: (action as AsyncActionFailedResult).error,
      },
    }[action.state];

    return {
      ...state,
      contacts: {
        ...state.contacts,
        ...transform,
      },
    };
  },

  navigateToConversation: function(state, action) {
    return {
      ...state,
      conversation: {
        ...state.conversation,
        contactId: action.contactId,
      },
    };
  },

  [UPDATE_CONVERSATION_UI]: function(
    state,
    action: UpdateConversationUiAction,
  ) {
    return {
      ...state,
      conversation: {
        ...state.conversation,
        ...action.data,
      },
    };
  },

  [START_COMPOSING_MESSAGE]: function(
    state,
    action: StartComposingMessageAction,
  ) {
    return {
      ...state,
      conversation: {
        ...state.conversation,
        composing: true,
      },
    };
  },

  [CANCEL_COMPOSING_MESSAGE]: function(
    state,
    action: CancelComposingMessageAction,
  ) {
    return {
      ...state,
      conversation: {
        ...state.conversation,
        composing: false,
        cancelling: true,
      },
    };
  },

  [CHANGE_THEME]: function(state, action: ChangeThemeAction) {
    return {...state, theme: action.theme};
  },

  [CHANGE_APP_STATE]: function(state, action: ChangeAppStateAction) {
    return {
      ...state,
      appState: action.newState,
      contacts: {
        ...state.contacts,
        shouldRefresh: action.newState === 'active',
      },
    };
  },

  [CHANGE_NETWORK]: function(state, action: ChangeNetworkAction) {
    return {
      ...state,
      network: action.network,
    };
  },
};

export default createRoutingReducer({
  handlers,
  initialState,
});
