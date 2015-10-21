import React from 'react-native';
import { connect } from 'react-redux/native';
import Style from '../style';
import PressableView from './PressableView';
import LoaderButton from './LoaderButton';
import { navigateTo } from '../actions/NavigationActions';
import { appName } from '../config';

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
            <Text>Welcome to {appName} beta{"\n\n"}</Text>
            <Text>{appName} allows you to send blocks of color to your friends{"\n\n"}</Text>
            <Text>{appName} authenticates you using your phone number and allows you to chat with contacts who also have the app installed{"\n\n"}</Text>
            <Text>Please let me know if you have any questions or suggestions, either by email or on Github{"\n\n"}</Text>
            <Text>Enjoy :)</Text>
          </Text>
        </View>

        <LoaderButton
          style={style.submit}
          loading={false}
          onPress={this.onPressNext}
          message="Get started"
        />
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
    flex: 1
  },
  content: {
    ...Style.mixins.contentWrapperBase,
    paddingRight: Style.values.outerPadding - 4
  },
  text: {
    ...Style.mixins.textBase
  },
  startButtonWrapper: {
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  startButton: {
    borderTopColor: '#BABABA',
    borderTopWidth: 1,
    height: Style.values.rowHeight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  startButtonActive: {
    backgroundColor: '#EFEFEF'
  },
  startButtonText: {
    ...Style.mixins.textBase
  }
});

export default connect(()=>({}))(WelcomeScreen);
