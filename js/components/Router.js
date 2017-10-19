import React, { Component } from 'react';
import {
  Dimensions,
  PixelRatio,
  BackHandler
} from 'react-native';
import {
  NavigationActions,
  addNavigationHelpers
} from 'react-navigation';
import invariant from 'invariant';
import { Provider, connect } from 'react-redux';
import buildStyleInterpolator from 'react-native/Libraries/Utilities/buildStyleInterpolator';
import { FromBottom, SlideOverFromBottom, SlideFromRight, SlideOverFromRight } from '../lib/SceneConfigs';
import AppNavigator from './AppNavigator';

class Router extends Component {
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, navigation } = this.props;
    if (navigation.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
    let navigation = addNavigationHelpers({
      dispatch: this.props.dispatch,
      state: this.props.navigation,
    });

    return <AppNavigator
      navigation={navigation}
    />;
  }
};

let selectNavigation = (state) => {
  return {
    navigation: state.navigation
  };
}

export default connect(selectNavigation)(Router);
