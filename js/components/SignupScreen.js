import React from 'react-native';
import KeyboardMixin from './mixins/KeyboardMixin';
import Style from '../style';
import Header from './Header';

let {
  View,
  Animated
} = React;

let SignupScreen = React.createClass({
  mixins: [KeyboardMixin],

  render: function () {
    let buttonStyle = [
      style.button,
      {
        transform: [
          { translateY: this.state.animatedKeyboardHeight }
        ]
      }
    ];

    return (
      <View style={style.container}>
        <Header
          title={this.props.title}
          showBack={!!this.props.onNavigateBack}
          onBack={this.props.onNavigateBack}
        />

        <View style={style.screenContent}>
          { this.props.children }
        </View>

        <Animated.View style={buttonStyle}>
          { this.props.renderNextButton() }
        </Animated.View>
      </View>
    );
  }

});

let style = Style.create({
  container: {
    ...Style.mixins.outerWrapperBase
  },
  screenContent: {
    ...Style.mixins.contentWrapperBase,
    paddingTop: 22
  },
  button: {
    flex: 0
  }
});

export default SignupScreen;
