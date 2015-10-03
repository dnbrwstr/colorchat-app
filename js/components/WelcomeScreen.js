import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import PressableView from './PressableView';
import { navigateTo } from '../actions/NavigationActions';

let {
  View,
  Text
} = React;

let WelcomeScreen = React.createClass({
  render: function () {
    return (
      <View style={style.wrapper}>
        <View style={style.content}>
          <Text style={style.text}>
            <Text>Hi{"\n\n"}</Text>
            <Text>Welcome to ColorChat beta{"\n\n"}</Text>
            <Text>ColorChat allows you to send blocks of color to your friends{"\n\n"}</Text>
            <Text>ColorChat authenticates you using your phone number and allows you to chat with contacts who also have the app installed{"\n\n"}</Text>
            <Text>Please let me know if you have any questions or suggestions, either by email or on Github{"\n\n"}</Text>
            <Text>Enjoy :)</Text>
          </Text>
        </View>

        <View style={style.startButtonWrapper}>
          <PressableView
            style={style.startButton}
            activeStyle={style.startButtonActive}
            onPress={this.onPressNext}
          >
            <Text style={style.startButtonText}>Start</Text>
          </PressableView>
        </View>
      </View>
    )
  },

  onPressNext: function () {
    this.props.dispatch(navigateTo('signup'));
  }
});

let style = Style.create({
  wrapper: {
    ...Style.mixins.outerWrapperBase,
  },
  content: {
    ...Style.mixins.contentWrapperBase
  },
  text: {
    ...Style.mixins.textBase
  },
  startButtonWrapper: {
    position: 'absolute',
    bottom: 30,
    right: 0,
    left: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  startButton: {
    backgroundColor: '#333',
    width: Style.values.rowHeight,
    height: Style.values.rowHeight,
    borderRadius: Style.values.rowHeight / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  startButtonActive: {
    backgroundColor: '#222'
  },
  startButtonText: {
    ...Style.mixins.textBase,
    color: '#CCC'
  }
});

export default connect(()=>({}))(WelcomeScreen);
