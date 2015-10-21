import React from 'react-native';
import KeyboardMixin from './mixins/KeyboardMixin';
import Style from '../style';
import Header from './Header';
import measure from '../measure';

let {
  View,
  Animated,
  ScrollView,
  Dimensions,
  Easing
} = React;

let SignupScreen = React.createClass({
  mixins: [KeyboardMixin],

  getInitialState: function () {
    return {
      measureTimeout: null,
      contentHeight: null,
      animatedContentHeight: new Animated.Value(Dimensions.get('window').height)
    };
  },

  handleLayout: async function () {
    // Debounce to prevent onLayout firing during animation
    if (this.state.measureTimeout) clearTimeout(this.state.measureTimeout);

    let measureTimeout = setTimeout(() => {
      this.measureContentSize();
      this.setState({ measureTimeout: null });
    }, 200);

    this.setState({ measureTimeout });
  },

  measureContentSize: async function () {
    let headerSize = await measure(this.refs.header);
    // Content stretches to fill all available space, so we add an
    // extra wrapper and use it to get the minimum size of the content
    let contentInnerSize = await measure(this.refs.contentInner);
    let buttonSize = await measure(this.refs.button);

    let contentHeight = headerSize.height + contentInnerSize.height + buttonSize.height;
    this.setState({ contentHeight });
  },

  keyboardMixinHandleKeyboardWillShow: function (frames) {
    let toValue = Math.max(
      Dimensions.get('window').height - frames.endCoordinates.height,
      this.state.contentHeight
    );

    Animated.timing(this.state.animatedContentHeight, {
      toValue,
      duration: 200,
      easing: Easing.inOut(Easing.ease)
    }).start();
  },

  keyboardMixinHandleKeyboardWillHide: function () {
    Animated.timing(this.state.animatedContentHeight, {
      toValue: Dimensions.get('window').height,
      duration: 200,
      easing: Easing.inOut(Easing.ease)
    }).start();
  },

  render: function () {
    let shadowStyle = [
      style.bottomShadow,
      { bottom: this.state.animatedKeyboardHeight }
    ];

    let wrapperStyle = [
      { height: this.state.animatedKeyboardEmptySpace }
    ];

    return (
      <View style={style.container}>
        <Animated.View style={wrapperStyle}>
          <ScrollView>
            <Animated.View style={{height: this.state.animatedContentHeight}} onLayout={this.handleLayout}>
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
            </Animated.View>
          </ScrollView>
        </Animated.View>

        <Animated.View style={shadowStyle} />
      </View>
    );
  }

});

let style = Style.create({
  container: {
    flex: 1
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
