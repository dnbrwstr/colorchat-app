import React, { Component } from "react";
import { StatusBar, Platform } from "react-native";
import Color from "color";
import AppNavigator from "./AppNavigator";
import NavigationService from "../lib/NavigationService";
import withStyles from "../lib/withStyles";

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

class Router extends Component {
  render() {
    const { theme } = this.props;
    if (Platform.OS === "android") {
      const backgroundColor = theme.backgroundColor;
      const brightness = Color(backgroundColor).luminosity();
      const barStyle = brightness > 0.5 ? "dark-content" : "light-content";
      StatusBar.setBackgroundColor(backgroundColor);
      StatusBar.setBarStyle(barStyle);
    }
    return (
      <AppNavigator
        ref={ref => NavigationService.setTopLevelNavigator(ref)}
        onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = getActiveRouteName(currentState);
          const prevScreen = getActiveRouteName(prevState);
          if (prevScreen !== currentScreen) {
            const route = getActiveRoute(currentState);
            NavigationService.setCurrentRoute(currentScreen);
          }
        }}
      />
    );
  }
}

export default withStyles(() => ({}))(Router);
