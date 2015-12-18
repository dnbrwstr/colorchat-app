import React from 'react-native';
import darken from 'color';
import Style from '../style';
import PressableView from './PressableView';
import AnimatedEllipsis from './AnimatedEllipsis';
import SquareButton from './SquareButton';

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

        <SquareButton
          style={{opacity: this.state.buttonOpacity}}
          label={this.props.message}
          onPress={this.props.onPress}
        />
      </View>
    );
  }
});

let style = Style.create({
  ellipsisContainer: {
    position: 'absolute',
    top: Style.values.outerPadding,
    left: Style.values.outerPadding,
    right: Style.values.outerPadding,
    bottom: Style.values.outerPadding,
    height: Style.values.buttonHeight,
    padding: Style.values.basePadding * 1.5
  }
});

export default LoaderButton;
