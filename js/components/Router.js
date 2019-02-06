import React, { Component } from 'react';
import { NavigationActions, NavigationEvents, getChildEventSubscribers } from 'react-navigation';
import AppNavigator from './AppNavigator';
import NavigationService from '../lib/NavigationService';

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

class Router extends Component {
  render() {
    return <AppNavigator
      ref={ref => NavigationService.setTopLevelNavigator(ref) }
      onNavigationStateChange={(prevState, currentState) => {
        const currentScreen = getActiveRouteName(currentState);
        const prevScreen = getActiveRouteName(prevState);
        if (prevScreen !== currentScreen) {
          NavigationService.setCurrentRoute(currentScreen);
        }
      }}
    />
  }
};

export default Router;
