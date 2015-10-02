import React from 'react-native';
import Style from '../style';
import { connect } from 'react-redux/native';
import { navigateToConversation } from '../actions/NavigationActions';
import { dismissInternalAlert } from '../actions/AppActions';
import PressableView from './PressableView';

let {
  View,
  Text,
  Animated
} = React;

let Alert = React.createClass({
  getInitialState: function () {
    return {
      animatedValue: new Animated.Value(0)
    }
  },

  componentDidMount: function () {
    Animated.timing(this.state.animatedValue, {
      toValue: 1,
      duration: 200
    }).start();

    this.setState({
      closeTimeout: setTimeout(this.close, 5000)
    });
  },

  render: function () {
    let alertStyles = [
      style.alert,
      {
        height: this.state.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Style.values.rowHeight]
        })
      }
    ];

    return (
      <Animated.View style={alertStyles}>
        <PressableView style={style.alertInner} onPress={this.onActivate}>
          <Text style={style.text}>{ this.props.message }</Text>
        </PressableView>
      </Animated.View>
    );
  },

  onActivate: function () {
    clearTimeout(this.state.closeTimeout);
    this.close();
    this.props.dispatch(navigateToConversation(this.props.senderId));
  },

  close: function () {
    Animated.timing(this.state.animatedValue, {
      toValue: 0,
      duration: 200
    }).start(() => {
      this.props.dispatch(dismissInternalAlert(this.props.id))
    });
  }
});

let style = Style.create({
  alert: {
    overflow: 'hidden',
    height: Style.values.rowHeight,
  },
  alertInner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    height: Style.values.rowHeight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    ...Style.mixins.textBase
  }
});

export default connect(()=>({}))(Alert);
