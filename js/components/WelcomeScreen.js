import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import PressableView from './PressableView';
import LoaderButton from './LoaderButton';
import { navigateTo } from '../actions/NavigationActions';
import config from '../config';
import { rand } from '../lib/Utils';
import TimerMixin from './mixins/TimerMixin';
import BaseText from './BaseText';

let { appName } = config;

let {
  View,
  Text
} = React;

let WelcomeScreen = React.createClass({
  mixins: [TimerMixin],

  componentDidMount: function () {
    this.setIntervalTimer('refresh', () => this.setState({}), 1000);
  },

  randomColor: function () {
    return `hsl(${rand(360)},100%,65%)`;
  },

  handlePressNext: function () {
    this.clearIntervalTimer('refresh');
    this.props.dispatch(navigateTo('signup'));
  },

  render: function () {
    return (
      <View style={style.wrapper}>
        <View style={style.titleContainer}>
          <BaseText style={style.title}>{ appName }</BaseText>
        </View>

        <View style={style.floatMessageContainer}>
          <View style={style.floatMessage}>
            <BaseText style={style.floatMessageText}>
              { this.renderColorizedText('Chat with') }{"\n"}
              { this.renderColorizedText('colors instead') }{"\n"}
              { this.renderColorizedText('of words') }
            </BaseText>
          </View>
        </View>

        <View style={style.bottomBar}>
          <PressableView style={style.bottomBarButton} onPress={this.handlePressNext}>
            <BaseText style={style.bottomBarButtonText}>Setup</BaseText>
          </PressableView>
        </View>
      </View>
    );
  },

  renderColorizedText: function (text) {
    return text.split('').map((letter, i) => {
      return <BaseText key={`letter-${i}`} style={{color: this.randomColor()}}>{letter}</BaseText>;
    });
  }
});

let style = Style.create({
  wrapper: {
    ...Style.mixins.outerWrapperBase,
    backgroundColor: 'black',
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
  },
  floatMessageText: {
    color: 'white',
    textAlign: 'center',
    lineHeight: 24
  }
});

export default connect(()=>({}))(WelcomeScreen);
