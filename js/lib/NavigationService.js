import { NavigationActions, StackActions } from "react-navigation";

let navigator;
let currentRoute = "";

export default {
  setTopLevelNavigator(navigatorRef) {
    navigator = navigatorRef;
  },

  setCurrentRoute(route) {
    currentRoute = route;
  },

  navigate(routeName, params) {
    // console.log('navigating', routeName, params);
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
    return currentRoute;
  }
};
