let React = require('react-native'),
  AuthScreen = require('./AuthScreen'),
  Style = require('../style');

var buildStyleInterpolator = require('react-native/Libraries/Utilities/buildStyleInterpolator')

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
      <Component {...route.passProps} navigator={navigator} />
    );
  }
});

module.exports = ColorChat;
