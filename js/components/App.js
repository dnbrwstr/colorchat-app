import React from 'react';
import {
  View,
  Animated,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { GatewayDest } from 'react-gateway';
import Router from './Router';
import Alert from './Alert';
import Style from '../style';

let appSelector = state => {
  return {
    alerts: state.ui.alerts,
    offline: state.ui.network === 'none'
  };
};

class App extends React.Component {
  static defaultProps = {
    alerts: []
  };

  state = {
    animatedOpacity: new Animated.Value(0),
    animatedOfflineMessageHeight: new Animated.Value(0)
  };

  componentDidMount() {
    Animated.timing(this.state.animatedOpacity, {
      toValue: 1,
      duration: 200
    }).start();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.offline !== prevProps.offline) {
      if (this.props.offline) {
        Animated.timing(this.state.animatedOfflineMessageHeight, {
          toValue: 40,
          duration: 200
        }).start();
      } else {
        Animated.timing(this.state.animatedOfflineMessageHeight, {
          toValue: 0,
          duration: 200
        }).start();
      }
    }
  }

  render() {
    let offlineMessageStyle = [style.offlineMessage, {
      height: this.state.animatedOfflineMessageHeight
    }];

    return (
      <Animated.View style={{flex: 1, opacity: this.state.animatedOpacity}}>
        <Animated.View style={offlineMessageStyle}>
          <View style={style.offlineMessageContent}>
            <Text style={style.offlineMessageText}>Unable to connect to network</Text>
          </View>
        </Animated.View>
        <Router />
        <View style={style.alerts}>
          { this.props.alerts.map((a) => {
            return ( <Alert key={a.id} {...a} /> );
          }) }
        </View>

        <GatewayDest name="top" component={View} style={{position: 'absolute', top: 0, left: 0, flex: 1}} />
      </Animated.View>
    )
  }
}

let style = Style.create({
  alerts: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  offlineMessage: {
    backgroundColor: 'black',
    alignItems: 'center',
  },
  offlineMessageContent: {
    height: 40,
    justifyContent: 'center',
  },
  offlineMessageText: {
    ...Style.mixins.textBase,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    lineHeight: 20
  }
});

export default connect(appSelector)(App);