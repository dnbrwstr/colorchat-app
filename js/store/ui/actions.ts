import {AppStateStatus} from 'react-native';
import {
  ConversationUiState,
  CHANGE_THEME,
  TRIGGER_MEMORY_WARNING,
  CHANGE_NETWORK,
  CHANGE_APP_STATE,
  UPDATE_CONVERSATION_UI,
  UpdateConversationUiAction,
  ChangeAppStateAction,
  ChangeNetworkAction,
  TriggerMemoryWarningAction,
  ChangeThemeAction,
} from './types';
import {NetInfoStateType} from '@react-native-community/netinfo';
import {Theme} from '../../style/themes';

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

export const changeTheme = (newTheme: Theme): ChangeThemeAction => {
  return {
    type: CHANGE_THEME,
    theme: newTheme,
  };
};
