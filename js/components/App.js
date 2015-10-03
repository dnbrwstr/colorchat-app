import React from 'react-native';
import { connect } from 'react-redux/native';
import Router from './Router';
import Alert from './Alert';
import Style from '../style';

let {
  View,
  Animated
} = React;

let appSelector = state => {
  return {
    alerts: state.ui.alerts,
  };
};

let App = React.createClass({
  getInitialState: function () {
    return {
      animatedOpacity: new Animated.Value(0)
    };
  },

  componentDidMount: function () {
    Animated.timing(this.state.animatedOpacity, {
      toValue: 1,
      duration: 200
    }).start();
  },

  render: function () {
    return (
      <Animated.View style={{flex: 1, opacity: this.state.animatedOpacity}}>
        <Router />
        <View style={style.alerts}>
          { this.props.alerts && this.props.alerts.map((a) => {
            return ( <Alert key={a.id} {...a} /> );
          }) }
        </View>
      </Animated.View>
    )
  }
});

let style = Style.create({
  alerts: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  }
});

export default connect(appSelector)(App);