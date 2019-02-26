import { NavigationActions, StackActions } from "react-navigation";

let navigator;
let currentRoute = "";

function getActiveRoute(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getActiveRoute(route);
  }
  return route;
}

function getActiveRouteName(navigationState) {
  return getActiveRoute(navigationState).routeName;
}

export default {
  setTopLevelNavigator(navigatorRef) {
    navigator = navigatorRef;
  },

  setCurrentRoute(route) {
    currentRoute = route;
  },

  navigate(routeName, params) {
    navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params
      })
    );
  },

  navigateBack() {
    navigator.dispatch(NavigationActions.back());
  },

  getCurrentRoute() {
    return getActiveRoute(navigator.state.nav);
  }
};
