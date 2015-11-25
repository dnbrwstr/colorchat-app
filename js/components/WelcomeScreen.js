import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import PressableView from './PressableView';
import LoaderButton from './LoaderButton';
import { navigateTo } from '../actions/NavigationActions';
import { appName } from '../config';
import BaseText from './BaseText';

let {
  View,
  Text,
  requireNativeComponent
} = React;

let WelcomeScreenBackground = requireNativeComponent('RCTWelcomeScreenBackground', null);

let WelcomeScreen = React.createClass({
  render: function () {
    return (
      <View style={style.wrapper}>
        <WelcomeScreenBackground style={style.welcome} />
        <View style={style.titleContainer}>
          <BaseText style={style.title}>ColorChat</BaseText>
        </View>
        <View style={style.floatMessageContainer}>
          <View style={style.floatMessage}>
            <BaseText style={style.floatMessageText}>Chat with{"\n"}colors instead{"\n"}of words</BaseText>
          </View>
        </View>
        <View style={style.bottomBar}>
          <PressableView style={style.bottomBarButton} onPress={this.onPressNext}>
            <BaseText style={style.bottomBarButtonText}>Setup</BaseText>
          </PressableView>
        </View>
      </View>
    );
  },

  onPressNext: function () {
    this.props.dispatch(navigateTo('signup'));
  }
});

let style = Style.create({
  wrapper: {
    ...Style.mixins.outerWrapperBase,
    backgroundColor: '#f8f8f8',
    flex: 1
  },
  welcome: {
    flex: 1
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Style.values.rowHeight,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: 'white',
    padding: 20,
    textAlign: 'center'
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Style.values.rowHeight,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  bottomBarButton: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomBarButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  floatMessageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  floatMessage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    color: '#999'
  },
  floatMessageText: {
    color: 'white',
    textAlign: 'center'
  }
});

export default connect(()=>({}))(WelcomeScreen);
