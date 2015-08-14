import React from 'react-native';
import { Provider } from 'react-redux/native';
import AuthScreen from './AuthScreen';
import Style from '../style';
import buildStyleInterpolator from 'react-native/Libraries/Utilities/buildStyleInterpolator';
import store from '../store';

let {
  Dimensions,
  PixelRatio,
  Navigator,
  NavigatorSceneConfigs
} = React;

let ColorChat = React.createClass({
  render: function () {
    return (
      <Navigator
        configureScene={this.configureScene}
        renderScene={this.renderScene}
        initialRoute={{
          component: AuthScreen,
          title: 'Auth',
          passProps: {}
        }} />
    );
  },

  configureScene: function (route) {
    // return Navigator.SceneConfigs.FloatFromBottom;
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
    let Component = route.component;
    let props = {
      navigator: navigator
    };

    return (
      <Provider store={store}>
        { () => <Component {...route.passProps} navigator={navigator} /> }
      </Provider>
    );
  }
});

module.exports = ColorChat;
