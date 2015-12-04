import React from 'react-native';
import invariant from 'invariant';
import { Provider, connect } from 'react-redux/native';
import buildStyleInterpolator from 'react-native/Libraries/Utilities/buildStyleInterpolator';
import { FromBottom, SlideOverFromBottom, SlideFromRight, SlideOverFromRight } from '../lib/SceneConfigs';
import { completeTransition } from '../actions/NavigationActions';
import AppRoutes, { getTransitionMethod } from '../lib/AppRoutes';

let {
  Dimensions,
  PixelRatio,
  Navigator
} = React;

let Router = React.createClass({
  componentDidMount: function () {
    this.refs.navigator.navigationContext.addListener('didfocus', () => {
      this.props.dispatch(completeTransition());
    });
  },

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
    switch (route.title) {
      case 'contacts':
      case 'settings':
        return SlideOverFromBottom
      case 'conversation':
        return SlideOverFromRight
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
