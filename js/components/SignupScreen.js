import React from 'react-native';
import KeyboardMixin from './mixins/KeyboardMixin';
import Style from '../style';
import Header from './Header';
import measure from '../lib/measure';
import TimerMixin from './mixins/TimerMixin';

let {
  View,
  Animated,
  ScrollView,
  Dimensions,
  Easing
} = React;

let SignupScreen = React.createClass({
  mixins: [KeyboardMixin, TimerMixin],

  getInitialState: function () {
    return {
      contentHeight: Dimensions.get('window').height,
      scrollHeight: Dimensions.get('window').height
    };
  },

  componentWillUnmount: function () {
    this.clearAllTimers();
  },

  keyboardMixinHandleKeyboardWillShow: function (frames) {
    this.setState({
      scrollHeight: Dimensions.get('window').height - frames.endCoordinates.height
    });
  },

  keyboardMixinHandleKeyboardWillHide: function () {
    this.setState({
      scrollHeight: Dimensions.get('window').height
    });
  },

  render: function () {
    let scrollWrapperStyle = [style.scrollWrapper, {
      height: this.state.scrollHeight
    }];

    let contentStyle = [{
      height: this.state.contentHeight,
    }];

    return (
      <View style={style.container}>
        <View style={scrollWrapperStyle}>
          <ScrollView>
            <View style={contentStyle}>
              <Header
                ref="header"
                title={this.props.title}
                showBack={!!this.props.onNavigateBack}
                onBack={this.props.onNavigateBack}
              />

              <View style={style.screenContent}>
                <View ref="contentInner" style={style.screenContentInner}>
                  { this.props.children }
                </View>
              </View>

              <View ref="button">
                { this.props.renderNextButton() }
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: Style.values.backgroundGray
  },
  scrollWrapper: {
    overflow: 'hidden',
  },
  screenContent: {
    ...Style.mixins.contentWrapperBase,
    paddingVertical: 0,
  },
  screenContentInner: {
    paddingBottom: 22
  },
  bottomShadow: {
    ...Style.mixins.shadowBase,
    shadowOpacity: .5,
    position: 'absolute',
    height: 1,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white'
  }
});

export default SignupScreen;
