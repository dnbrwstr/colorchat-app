import React from 'react-native';
import { Provider, connect } from 'react-redux/native';
import AuthScreen from './AuthScreen';
import CountryPickerScreen from './CountryPickerScreen';
import ConfirmCodeScreen from './ConfirmCodeScreen';
import buildStyleInterpolator from 'react-native/Libraries/Utilities/buildStyleInterpolator';
import MainScreen from './MainScreen';

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
      let fn = nextProps.reverse ? 'popToRoute' : 'push';
      this.refs.navigator[fn](nextProps.route);
    }
  },

  configureScene: function (route) {
    return {
      gestures: null,
      defaultTransitionVelocity: 3,
      springFriction: 20,
      springTension: 200,
      animationInterpolators: {
        into: buildStyleInterpolator({
          opacity: {
            value: 1.0,
            type: 'constant',
          },
          transformTranslate: {
            from: {x: 0, y: Dimensions.get('window').height, z: 0},
            to: {x: 0, y: 0, z: 0},
            min: 0,
            max: 1,
            type: 'linear',
            extrapolate: true,
            round: PixelRatio.get(),
          },
          translateY: {
            from: Dimensions.get('window').height,
            to: 0,
            min: 0,
            max: 1,
            type: 'linear',
            extrapolate: true,
            round: PixelRatio.get(),
          },
          scaleX: {
            value: 1,
            type: 'constant',
          },
          scaleY: {
            value: 1,
            type: 'constant',
          }
        }),
        out: buildStyleInterpolator({
          opacity: {
            from: 1,
            to : .7,
            min: 0,
            max: 1,
            type: 'linear',
            extrapolate: false,
            round: 100
          }
        })
      }
    }
  },

  renderScene: function (route, navigator) {
    let pageComponents = {
      registration: AuthScreen,
      countryPicker: CountryPickerScreen,
      confirmCode: ConfirmCodeScreen,
      main: MainScreen
    };

    let Component = pageComponents[route.title];

    return (
      <Component {...route.data} />
    );
  }
});

let selectNavigation = (state) => state.navigation;

export default connect(selectNavigation)(Router);
