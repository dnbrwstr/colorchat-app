import invariant from 'invariant';
import { findIndex, propEq } from 'ramda';
import { NavigationActions } from 'react-navigation';
import createRoutingReducer from '../lib/createRoutingReducer';
import AppNavigator from '../components/AppNavigator';

const getStateForAction = (action, state) => AppNavigator.router.getStateForAction(action, state);
const getActionForPath = (path, params) => AppNavigator.router.getActionForPathAndParams(path, params);

const logoutAction = getActionForPath('login');
const loginAction = getActionForPath('welcome');

const loggedOutState = getStateForAction(logoutAction);
const loggedInState = getStateForAction(loginAction);

const initialState = {
  loggedOutState,
  loggedInState
};

const handlers = {
  init: function (state, action) {
    return {
      ...state,
      loggedInState: getStateForAction(loginAction, loggedOutState)     
    }
  },

  login: function (state, action) {
    if (action.state === 'complete') {
      return {
        ...state,
        loggedInState: getStateForAction(loginAction, loggedOutState)     
      }
    } else {
      return state;
    }
  },

  logout: function (state, action) {
    const newLoggedOutState = getStateForAction(
      NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "login" })]
      })
    );

    return {
      ...state,
      loggedOutState: newLoggedOutState
    };
  },

  connectToCamera: function (state, action) {
    if (action.state === 'complete') {
      return NavigationActions.navigate({ routeName: 'pairingSuccess'});
    } else {
      return state;
    }
  },

  startNavigationTransition: function (state, action) {
    return {
      ...state,
      transitioning: true
    };
  },

  endNavigationTransition: function (state, action) {
    return {
      ...state,
      transitioning: false
    };
  }
};

export const navigationReducer = (state = initialState, action) => {
  console.log(action.type);
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  } else {
    const nextState = AppNavigator.router.getStateForAction(action, state) || state;
    return nextState;
  }
};
