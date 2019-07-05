import { NavigationActions, StackActions } from "react-navigation";

let navigator;

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

export default {
  setTopLevelNavigator(navigatorRef) {
    navigator = navigatorRef;
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
