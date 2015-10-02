import React from 'react-native';
import { connect } from 'react-redux/native';
import Router from './Router';
import Alert from './Alert';
import Style from '../style';

let {
  View
} = React;

let appSelector = state => {
  return {
    alerts: state.ui.alerts
  };
};

let App = React.createClass({
  render: function () {
    console.log(this.props.alerts)
    return (
      <View style={{flex: 1}}>
        <Router />
        <View style={style.alerts}>
          { this.props.alerts && this.props.alerts.map((a) => {
            return ( <Alert key={a.id} {...a} /> );
          }) }
        </View>
      </View>
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