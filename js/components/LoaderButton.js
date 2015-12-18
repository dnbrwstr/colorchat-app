import React from 'react-native';
import darken from 'color';
import Style from '../style';
import PressableView from './PressableView';
import AnimatedEllipsis from './AnimatedEllipsis';

let {
  View,
  Text,
  Animated,
  PixelRatio
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
          </View>  }

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

let style = Style.create({
  button: {
    flex: 0,
    justifyContent: 'center',
    height: Style.values.buttonHeight,
    margin: Style.values.outerPadding,
    padding: Style.values.basePadding * 1.5,
    borderColor: Style.values.midGray,
    borderWidth: 1 / PixelRatio.get(),
  },
  buttonActive: {
    backgroundColor: Style.values.fairlyLightGray
  },
  ellipsisContainer: {
    position: 'absolute',
    top: Style.values.outerPadding,
    left: Style.values.outerPadding,
    right: Style.values.outerPadding,
    bottom: Style.values.outerPadding,
    height: Style.values.rowHeight,
    padding: Style.values.basePadding * 1.5
  },
  text: {
    mixins: [Style.mixins.textBase],
    textAlign: 'center'
  }
});

export default LoaderButton;
