import React from 'react-native';
import darken from 'color';
import Style from '../style';
import PressableView from './PressableView';
import AnimatedEllipsis from './AnimatedEllipsis';

let {
  View,
  Text,
  Animated
} = React;

let LoaderButton = React.createClass({
  getInitialState: function () {
    let buttonOpacity = this.props.loading ? 0 : 1;

    return {
      buttonOpacity: new Animated.Value(buttonOpacity)
    };
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (nextProps.loading && !this.props.loading) {
      Animated.timing(this.state.buttonOpacity, {
        toValue: 0,
        duration: 100
      }).start();
    } else if (!nextProps.loading && this.props.loading) {
      Animated.timing(this.state.buttonOpacity, {
        toValue: 1,
        duration: 100
      }).start();
    }
  },

  render: function () {
    return (
      <View>
        { this.props.loading &&
          <View style={style.ellipsisContainer}>
            <AnimatedEllipsis />
          </View>
        }
        <PressableView
          style={[style.button, {opacity: this.state.buttonOpacity}]}
          activeStyle={style.buttonActive}
          onPress={this.props.onPress}
        >
          <Text style={style.text}>{this.props.message}</Text>
        </PressableView>
      </View>
    );
  }
});

module.exports = LoaderButton;

let buttonHeight = 50;

let style = Style.create({
  button: {
    flex: 0,
    height: Style.values.rowHeight,
    justifyContent: 'center',
    backgroundColor: Style.values.midGray,
    padding: Style.values.basePadding * 1.5
  },
  buttonActive: {
    backgroundColor: darken(Style.values.midGray, .1).hexString()
  },
  ellipsisContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: buttonHeight
  },
  text: {
    mixins: [Style.mixins.textBase],
    color: 'white',
    textAlign: 'center'
  }
});
