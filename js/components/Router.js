import React from 'react-native';
import { Provider, connect } from 'react-redux/native';
import SignupStartScreen from './SignupStartScreen';
import CountryPickerScreen from './CountryPickerScreen';
import ConfirmCodeScreen from './ConfirmCodeScreen';
import ConversationScreen from './ConversationScreen';
import buildStyleInterpolator from 'react-native/Libraries/Utilities/buildStyleInterpolator';
import MainScreen from './MainScreen';
import { FromBottom } from '../lib/SceneConfigs'

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
    return FromBottom;
  },

  renderScene: function (route, navigator) {
    let pageComponents = {
      signup: SignupStartScreen,
      countryPicker: CountryPickerScreen,
      confirmCode: ConfirmCodeScreen,
      main: MainScreen,
      conversation: ConversationScreen
    };

    let Component = pageComponents[route.title];

    return (
      <Component {...route.data} />
    );
  }
});

let selectNavigation = (state) => state.navigation;

export default connect(selectNavigation)(Router);
