import invariant from "invariant";
import { findIndex, propEq } from "ramda";
import { NavigationActions } from "react-navigation";
import createRoutingReducer from "../lib/createRoutingReducer";
import { getTransitionMethod } from "../lib/AppRoutes";
import AppNavigator from "../components/AppNavigator";

const initialState = AppNavigator.router.getStateForAction(
  NavigationActions.navigate({ routeName: "main" })
);

let handlers = {
  init: function(state, action) {
    const { appState } = action;
    if (appState.user && appState.user.token) {
      return this.navigateToTitle("inbox", state);
    } else {
      return this.navigateToTitle("welcome", state);
    }
  },

  startNavigationTransition: function(state, action) {
    return {
      ...state,
      transitioning: true
    };
  },

  endNavigationTransition: function(state, action) {
    return {
      ...state,
      transitioning: false
    };
  },

  authError: function(state, action) {
    return this.navigateToTitle("welcome", state);
  },

  registerPhoneNumber: function(state, action) {
    if (action.state !== "complete") return state;
    return this.navigateToTitle("confirmCode", state);
  },

  submitConfirmationCode: function(state, action) {
    if (action.state !== "complete") return state;
    return this.navigateToTitle("notifications", state);
  },

  submitNotificationName: function(state, action) {
    return this.navigateToTitle("inbox", state);
  },

  logout: function(state, action) {
    return this.navigateToTitle("welcome", state);
  },

  deleteAccount: function(state, action) {
    return this.navigateToTitle("welcome", state);
  },

  navigateToTitle: function(title, state) {
    return AppNavigator.router.getStateForAction(
      NavigationActions.navigate({ routeName: title }),
      state
    );
  }
};

const navReducer = (state = initialState, action) => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action);
  } else {
    const nextState =
      AppNavigator.router.getStateForAction(action, state) || state;
    return nextState;
  }
};

export default navReducer;
