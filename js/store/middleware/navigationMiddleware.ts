import NavigationService from '../../lib/NavigationService';
import {AppState} from '../createStore';
import {AnyAction, MiddlewareAPI, Dispatch} from 'redux';

type NavigationHandler = (state: AppState, action: AnyAction) => void;

interface NavigationHandlerMap {
  [key: string]: NavigationHandler;
}

const navigationMiddleware = (store: MiddlewareAPI) => (next: Dispatch) => {
  const handlers: NavigationHandlerMap = {
    navigateTo: function(state, action) {
      NavigationService.navigate(action.routeName, action.params);
    },

    navigateBack: function() {
      NavigationService.navigateBack();
    },

    navigateToConversation: function() {
      NavigationService.navigate('conversation');
    },

    authError: function(state, action) {
      NavigationService.navigate('auth');
    },

    registerPhoneNumber: function(state, action) {
      if (action.state !== 'complete') return;
      NavigationService.navigate('confirmCode');
    },

    submitConfirmationCode: function(state, action) {
      if (action.state !== 'complete') return;
      NavigationService.navigate('notifications');
    },

    submitNotificationName: function(state, action) {
      NavigationService.navigate('app');
    },

    blockUser: function(state, action) {
      if (action.state !== 'complete') return;
      NavigationService.navigate('inbox');
    },

    logout: function(state, action) {
      NavigationService.navigate('welcome');
    },

    deleteAccount: function(state, action) {
      NavigationService.navigate('welcome');
    },
  };

  return (action: AnyAction) => {
    next(action);

    if (handlers[action.type]) {
      handlers[action.type](store.getState(), action);
    }
  };
};

export default navigationMiddleware;
