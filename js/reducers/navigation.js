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
  state: 'ready'
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
        title: 'welcome'
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
      state: 'ready',
      history: history,
      route: route
    };
  },

  authError: function (state, action) {
    return this.navigateToTitle('signup', state);
  },

  registerPhoneNumber: function (state, action) {
    if (action.state !== 'complete') return state;
    return this.navigateToTitle('confirmCode', state);
  },

  submitConfirmationCode: function (state, action) {
    if (action.state !== 'complete') return state;
    return this.navigateToTitle('notifications', state);
  },

  submitNotificationName: function (state, action) {
    return this.navigateToTitle('main', state);
  },

  completeTransition: function (state, action) {
    let newState = {
      ...state,
      state: 'ready'
    };
    return newState;
  },

  navigateToTitle: function (title, state) {
    return this.navigateTo(state, {
      route: {
        title: title
      }
    });
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
        state: 'transitioning',
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
