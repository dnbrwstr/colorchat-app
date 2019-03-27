import React from "react";
import createReactClass from "create-react-class";
import { View, Text, TextInput } from "react-native";
import { connect } from "react-redux";
import Style from "../style";
import PressableView from "./PressableView";
import config from "../config";
import { rand } from "../lib/Utils";
import TimerMixin from "./mixins/TimerMixin";
import BaseText from "./BaseText";
import { navigateTo } from "../actions/NavigationActions";
import withStyles from "../lib/withStyles";
import { ifIphoneX } from "react-native-iphone-x-helper";

let { appName } = config;

let WelcomeScreen = createReactClass({
  displayName: "WelcomeScreen",
  mixins: [TimerMixin],

  componentDidMount: function() {
    this.timer = setInterval(() => {
      this.setState({});
    }, 1000);
  },

  componentWillUnmount: function() {
    clearInterval(this.timer);
  },

  randomColor: function() {
    return `hsl(${rand(360)},100%,65%)`;
  },

  handlePressNext: function() {
    this.clearIntervalTimer("refresh");
    this.props.dispatch(navigateTo("signup"));
  },

  render: function() {
    const { styles } = this.props;
    return (
      <View style={styles.wrapper}>
        <View style={styles.titleContainer}>
          <BaseText style={styles.title}>{appName}</BaseText>
        </View>

        <View style={styles.floatMessageContainer}>
          <View style={styles.floatMessage}>
            <BaseText style={styles.floatMessageText}>
              {this.renderColorizedText("Chat with")}
              {"\n"}
              {this.renderColorizedText("colors instead")}
              {"\n"}
              {this.renderColorizedText("of words")}
            </BaseText>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <PressableView
            style={styles.bottomBarButton}
            onPress={this.handlePressNext}
          >
            <BaseText style={styles.bottomBarButtonText}>Setup</BaseText>
          </PressableView>
        </View>
      </View>
    );
  },

  renderColorizedText: function(text) {
    return text.split("").map((letter, i) => {
      return (
        <BaseText key={`letter-${i}`} style={{ color: this.randomColor() }}>
          {letter}
        </BaseText>
      );
    });
  }
});

let getStyles = theme => ({
  wrapper: {
    ...Style.mixins.outerWrapperBase,
    backgroundColor: theme.backgroundColor,
    flex: 1
  },
  welcome: {
    flex: 1
  },
  titleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Style.values.rowHeight,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: theme.primaryTextColor,
    padding: 20,
    textAlign: "center"
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    ...ifIphoneX({ bottom: 30 }),
    left: 0,
    right: 0,
    height: Style.values.rowHeight,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "stretch"
  },
  bottomBarButton: {
    flex: 1,
    justifyContent: "center"
  },
  bottomBarButtonText: {
    color: theme.primaryTextColor,
    textAlign: "center"
  },
  floatMessageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  floatMessage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black"
  },
  floatMessageText: {
    color: theme.primaryTextColor,
    textAlign: "center",
    lineHeight: 24
  }
});

export default withStyles(getStyles)(connect(() => ({}))(WelcomeScreen));
