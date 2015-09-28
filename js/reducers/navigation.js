import invariant from 'invariant';
import { findIndex, propEq } from 'ramda';
import createRoutingReducer from '../lib/createRoutingReducer';
import { getTransitionMethod } from '../lib/AppRoutes';

let initialRoute = {
  title: 'main',
  data: {},
};

let initialState = {
  history: [initialRoute],
  route: initialRoute,
  reverse: false
};

let handlers = {
  init: function (state, action) {
    let { appState } = action;
    let route, history;

    if (appState.navigation && appState.navigation.history.length) {
      history = appState.navigation.history;
      route = history[history.length - 1];
    } else if (!appState.user || !appState.user.token) {
      route = {
        title: 'signup'
      };
    } else {
      route = {
        title: 'main'
      };
    }

    if (!history) {
      history = [route]
    }

    return {
      history: history,
      route: route
    };
  },

  authError: function (state, action) {
    return this.navigateTo(state, {
      route: {
        title: 'signup'
      }
    });
  },

  registerPhoneNumber: function (state, action) {
    if (action.state == 'complete') {
      return this.navigateTo(state, {
        route: {
          title: 'confirmCode'
        }
      });
    } else {
      return state;
    }
  },

  submitConfirmationCode: function (state, action) {
    if (action.state == 'complete') {
      return this.navigateTo(state, {
        route: {
          title: 'main'
        }
      })
    } else {
      return state;
    }
  },

  navigateTo: (state, action) => {
    let { route, history } = state;
    let newRoute = action.route;
    let newHistory;

    if (newRoute.title !== route.title || newRoute.data !== route.data) {
      let method = getTransitionMethod(route.title, newRoute.title);
      if (method === 'push') {
        newHistory = [...history, newRoute];
      } else if (method === 'pop') {
        let index = findIndex(propEq('title', newRoute.title))(history);
        newHistory = history.slice(0, index + 1);
        newRoute = history[index];
      } else if (method === 'reset') {
        newHistory = [newRoute];
      }

      return {
        ...state,
        history: newHistory,
        route: newRoute
      }
    } else {
      return state;
    }
  }
};

export default createRoutingReducer({
  key: 'navigation',
  handlers,
  initialState
});
