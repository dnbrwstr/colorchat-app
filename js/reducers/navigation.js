import invariant from 'invariant';
import createRoutingReducer from '../lib/createRoutingReducer';

let initialState = {
  history: [],
  route: {
    title: 'registration',
    data: {},
  },
  reverse: false
};

let handlers = {
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

  navigateTo: (state, action) => {
    let { route, history } = state;
    let newRoute = action.route;
    let newHistory;

    if (newRoute.title !== route.title || newRoute.data !== route.data) {
      if (action.reverse) {
        invariant(
          history.indexOf(newRoute) !== -1,
          'Can\'t pop to a nonexistant route'
        );

        newHistory = history.slice(0, history.indexOf(newRoute) + 1);
      } else {
        newHistory = history = [...history, route];
      }

      return {
        ...state,
        history: newHistory,
        route: newRoute,
        reverse: action.reverse
      }
    } else {
      return state;
    }
  }
};

export default createRoutingReducer(handlers, initialState);
