import React from 'react-native';
import invariant from 'invariant';
import { Provider, connect } from 'react-redux/native';
import buildStyleInterpolator from 'react-native/Libraries/Utilities/buildStyleInterpolator';
import { FromBottom, SlideOverFromBottom } from '../lib/SceneConfigs'
import AppRoutes, { getTransitionMethod } from '../lib/AppRoutes';

let {
  Dimensions,
  PixelRatio,
  Navigator,
  NavigatorSceneConfigs
} = React;

let Router = React.createClass({
  render: function () {
    let props = {
      ref: "navigator",
      configureScene: this.configureScene,
      renderScene: this.renderScene,
      initialRoute: this.props.route,
      initialRouteStack: this.props.history
    };

    return <Navigator {...props} />
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (nextProps.route !== this.props.route) {
      let method = getTransitionMethod(this.props.route.title, nextProps.route.title);

      let fn = {
        pop: 'popToRoute',
        push: 'push',
        reset: 'replace'
      }[method];

      this.refs.navigator[fn](nextProps.route);
    }
  },

  configureScene: function (route) {
    console.log(route.title);

    switch (route.title) {
      case 'conversation':
        return SlideOverFromBottom
        break;
      default:
        return FromBottom
    }
  },

  renderScene: function (route, navigator) {
    let Component = AppRoutes[route.title].component;

    invariant(
      Component,
      'Tried to navigate to non-existent route "' + route.title + '"'
    );

    return (
      <Component {...route.data} />
    );
  }
});

let selectNavigation = (state) => state.navigation;

export default connect(selectNavigation)(Router);
