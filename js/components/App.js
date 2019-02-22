import React from "react";
import { View, Animated, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { GatewayDest } from "react-gateway";
import Router from "./Router";
import Alert from "./Alert";
import Style from "../style";
import FunctionView from "./FunctionView";
import withStyles from "../lib/withStyles";

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
    const { styles } = this.props;

    let offlineMessageStyle = [
      styles.offlineMessage,
      {
        height: this.state.animatedOfflineMessageHeight
      }
    ];

    return (
      <Animated.View
        style={[styles.container, { opacity: this.state.animatedOpacity }]}
      >
        <Animated.View style={offlineMessageStyle}>
          <View style={styles.offlineMessageContent}>
            <Text style={styles.offlineMessageText}>
              Unable to connect to network
            </Text>
          </View>
        </Animated.View>
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
      </Animated.View>
    );
  }
}

const getStyles = theme => ({
  container: {
    borderTopColor: theme.borderColor,
    borderTopWidth: StyleSheet.hairlineWidth,
    flex: 1
  },
  alerts: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
  offlineMessage: {
    backgroundColor: "black",
    alignItems: "center"
  },
  offlineMessageContent: {
    height: 40,
    justifyContent: "center"
  },
  offlineMessageText: {
    ...Style.mixins.textBase,
    color: "white",
    textAlign: "center",
    alignItems: "center",
    lineHeight: 20
  }
});

let appSelector = state => {
  return {
    alerts: state.ui.alerts,
    offline: state.ui.network === "none"
  };
};

export default withStyles(getStyles)(connect(appSelector)(App));
