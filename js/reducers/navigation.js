import invariant from 'invariant';
import createRoutingReducer from '../lib/createRoutingReducer';

let initialRoute = {
  title: 'registration',
  data: {},
};

let initialState = {
  history: [initialRoute],
  route: initialRoute,
  reverse: false
};

let handlers = {
  registerPhoneNumber: function (state, action) {
    // if (action.state == 'complete') {
    if (action.state == 'complete' || action.state == 'failed') {
      console.log(state);
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

    console.log(newRoute, route);

    if (newRoute.title !== route.title || newRoute.data !== route.data) {
      console.log(1);
      if (action.reverse) {
        console.log('2a')
        invariant(
          history.indexOf(newRoute) !== -1,
          'Can\'t pop to a nonexistant route'
        );

        newHistory = history.slice(0, history.indexOf(newRoute) + 1);
      } else {
        console.log('2b')
        newHistory = [...history, newRoute];
      }
      console.log(3);
      console.log(newRoute);

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
