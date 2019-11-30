import {BackHandler} from 'react-native';
import {
  NavigationActions,
  NavigationRoute,
  NavigationContainerComponent,
} from 'react-navigation';

let navigator: NavigationContainerComponent | null = null;

function getActiveRoute(navigationState: {
  index: number;
  routes: NavigationRoute[];
}): NavigationRoute | null {
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
  setTopLevelNavigator(navigatorRef: NavigationContainerComponent | null) {
    navigator = navigatorRef;

    BackHandler.addEventListener('hardwareBackPress', () => {
      if (!navigator) return;
      const currentRoute = getActiveRoute(navigator.state.nav);
      if (!currentRoute) return;
      // Returning true will prevent react-navigation from responding
      // to the back button press event. The code below prevents back
      // navigation on the inbox screem.
      if (currentRoute.routeName === 'inbox') {
        BackHandler.exitApp();
        return true;
      }
    });
  },

  navigate<T extends {}>(routeName: string, params: T) {
    navigator?.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      }),
    );
  },

  navigateBack() {
    navigator?.dispatch(NavigationActions.back());
  },

  getCurrentRoute() {
    // @ts-ignore Nav exists!!!
    return getActiveRoute(navigator?.state.nav);
  },
};
