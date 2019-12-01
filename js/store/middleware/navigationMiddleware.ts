import NavigationService from '../../lib/NavigationService';
import {AppState} from '../createStore';
import {AnyAction, MiddlewareAPI, Dispatch} from 'redux';

type NavigationHandler = (state: AppState, action: AnyAction) => void;

interface NavigationHandlerMap {
  [key: string]: NavigationHandler;
}

const navigationMiddleware = (store: MiddlewareAPI) => (next: Dispatch) => {
  const navigate = (routeName: string, params?: any) => {
    NavigationService.navigate(routeName, params || {});
  };

  const handlers: NavigationHandlerMap = {
    navigateTo: function(state, action) {
      navigate(action.routeName, action.params);
    },

    navigateBack: function() {
      NavigationService.navigateBack();
    },

    navigateToConversation: function() {
      navigate('conversation');
    },

    authError: function(state, action) {
      navigate('auth');
    },

    registerPhoneNumber: function(state, action) {
      if (action.state !== 'complete') return;
      navigate('confirmCode');
    },

    submitConfirmationCode: function(state, action) {
      if (action.state !== 'complete') return;
      navigate('notifications');
    },

    submitNotificationName: function(state, action) {
      navigate('app');
    },

    blockUser: function(state, action) {
      if (action.state !== 'complete') return;
      navigate('inbox');
    },

    logout: function(state, action) {
      navigate('welcome');
    },

    deleteAccount: function(state, action) {
      navigate('welcome');
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
