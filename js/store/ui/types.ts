import {Theme} from '../../style/themes';
import {AppState, AppStateStatic, AppStateStatus} from 'react-native';
import {NetInfoState, NetInfoStateType} from '@react-native-community/netinfo';

export interface UiAlert {
  id: string;
}

export interface SignupUiState {
  loading: boolean;
  error: string | null;
}

export interface ConfirmationCodeUiState {
  loading: boolean;
  error: string | null;
}

export interface ContactsUiState {
  imported: boolean;
  importInProgress: boolean;
  importError: string | null;
  shouldRefresh: boolean;
}

export interface ConversationUiState {
  contactId: number | null;
  sending: boolean;
  composing: boolean;
  cancelling: boolean;
  loading: boolean;
}

export interface UiState {
  appState: AppStateStatus;
  network: NetInfoStateType;
  signup: SignupUiState;
  confirmationCode: ConfirmationCodeUiState;
  countryPicker: {};
  contacts: ContactsUiState;
  inbox: {};
  conversation: ConversationUiState;
  theme: Theme;
}

export const UPDATE_CONVERSATION_UI = 'updateConversationUi';
export const CHANGE_APP_STATE = 'changeAppState';
export const CHANGE_NETWORK = 'changeNetwork';
export const TRIGGER_MEMORY_WARNING = 'triggerMemoryWarning';
export const CHANGE_THEME = 'changeTheme';
export const SOCKET_DISCONNECTED = 'socketDisconnected';
export const AUTH_ERROR = 'authError';

export interface UpdateConversationUiAction {
  type: typeof UPDATE_CONVERSATION_UI;
  data: Partial<ConversationUiState>;
}
export interface ChangeAppStateAction {
  type: typeof CHANGE_APP_STATE;
  newState: AppStateStatus;
}

export interface ChangeNetworkAction {
  type: typeof CHANGE_NETWORK;
  network: NetInfoStateType;
}

export interface TriggerMemoryWarningAction {
  type: typeof TRIGGER_MEMORY_WARNING;
}

export interface ChangeThemeAction {
  type: typeof CHANGE_THEME;
  theme: Theme;
}

export interface SocketDisconnectedAction {
  type: typeof SOCKET_DISCONNECTED;
  error: string;
}

export interface AuthErrorAction {
  type: typeof AUTH_ERROR;
}
