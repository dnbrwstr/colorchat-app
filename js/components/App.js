import React from "react";
import { View, Animated, StyleSheet, Platform } from "react-native";
import { connect } from "react-redux";
import { GatewayDest } from "react-gateway";
import Router from "./Router";
import Alert from "./Alert";
import Style from "../style";
import OfflineMessage from "./OfflineMessage";
import FunctionView from "./FunctionView";
import withStyles from "../lib/withStyles";

class App extends React.Component {
  static defaultProps = {
    alerts: []
  };

  state = {
    animatedOpacity: new Animated.Value(0)
  };

  componentDidMount() {
    Animated.timing(this.state.animatedOpacity, {
      toValue: 1,
      duration: 200
    }).start();
  }

  render() {
    const { styles } = this.props;

    return (
      <Animated.View
        style={[styles.container, { opacity: this.state.animatedOpacity }]}
      >
        <View style={styles.containerInner}>
          <OfflineMessage />
          <Router />
          <View style={styles.alerts}>
            {this.props.alerts.map(a => {
              return <Alert key={a.id} {...a} />;
            })}
          </View>

          <GatewayDest
            name="top"
            component={FunctionView}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </View>
      </Animated.View>
    );
  }
}

const getStyles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    ...Platform.select({
      ios: { paddingTop: 20 },
      android: {}
    })
  },
  containerInner: {
    flex: 1,
    borderTopColor: theme.secondaryBorderColor,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  alerts: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  }
});

let appSelector = state => {
  return {
    alerts: state.ui.alerts
  };
};

export default withStyles(getStyles)(connect(appSelector)(App));
