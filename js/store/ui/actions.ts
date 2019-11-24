import {AppStateStatus} from 'react-native';
import {
  ConversationUiState,
  TRIGGER_MEMORY_WARNING,
  CHANGE_NETWORK,
  CHANGE_APP_STATE,
  UPDATE_CONVERSATION_UI,
  UpdateConversationUiAction,
  ChangeAppStateAction,
  ChangeNetworkAction,
  TriggerMemoryWarningAction,
  AuthErrorAction,
  AUTH_ERROR,
  SocketDisconnectedAction,
  SOCKET_DISCONNECTED,
} from './types';
import {NetInfoStateType} from '@react-native-community/netinfo';

export const updateConversationUi = (
  newData: Partial<ConversationUiState>,
): UpdateConversationUiAction => {
  return {
    type: UPDATE_CONVERSATION_UI,
    data: newData,
  };
};

export const changeAppState = (
  newState: AppStateStatus,
): ChangeAppStateAction => {
  return {
    type: CHANGE_APP_STATE,
    newState,
  };
};

export const changeNetwork = (
  network: NetInfoStateType,
): ChangeNetworkAction => {
  return {
    type: CHANGE_NETWORK,
    network,
  };
};

export const triggerMemoryWarning = (): TriggerMemoryWarningAction => {
  return {
    type: TRIGGER_MEMORY_WARNING,
  };
};

export const authError = (): AuthErrorAction => {
  return {
    type: AUTH_ERROR,
  };
};

export const socketDisconnected = (error: string): SocketDisconnectedAction => {
  return {
    type: SOCKET_DISCONNECTED,
    error: error,
  };
};
