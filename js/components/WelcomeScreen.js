import React, { Component } from "react";
import { View, Text, TextInput } from "react-native";
import { connect } from "react-redux";
import Style from "../style";
import PressableView from "./PressableView";
import config from "../config";
import { rand } from "../lib/Utils";
import BaseText from "./BaseText";
import { navigateTo } from "../actions/NavigationActions";
import withStyles from "../lib/withStyles";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { getFocusStateChange } from "../lib/NavigationUtils";
import {
  withScreenFocusState,
  withScreenFocusStateProvider
} from "./ScreenFocusState";

let { appName } = config;

class WelcomeScreen extends Component {
  componentDidUpdate(prevProps, prevState) {
    const change = getFocusStateChange(
      prevProps.screenFocusState,
      this.props.screenFocusState
    );

    if (change.entered) {
      this.timer = setInterval(() => {
        this.setState({});
      }, 1000);
    } else if (change.exited) {
      clearInterval(this.timer);
    }
  }

  randomColor() {
    return `hsl(${rand(360)},100%,65%)`;
  }

  handlePressNext() {
    this.clearIntervalTimer("refresh");
    this.props.dispatch(navigateTo("signup"));
  }

  render() {
    const { styles } = this.props;
    return (
      <View style={styles.wrapper}>
        <View style={styles.titleContainer}>
          <BaseText style={styles.title}>{appName}</BaseText>
        </View>

        <View style={styles.floatMessageContainer}>
          <View style={styles.floatMessage}>
            <Text style={styles.floatMessageText}>
              {this.renderColorizedText("Chat with")}
              {"\n"}
              {this.renderColorizedText("colors instead")}
              {"\n"}
              {this.renderColorizedText("of words")}
            </Text>
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
  }

  renderColorizedText(text) {
    return text.split("").map((letter, i) => {
      return (
        <Text key={`letter-${i}`} style={{ color: this.randomColor() }}>
          {letter}
        </Text>
      );
    });
  }
}

const addStyle = withStyles(theme => ({
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
    ...Style.mixins.textBase,
    color: theme.primaryTextColor,
    textAlign: "center",
    lineHeight: 24
  }
}));

const addFocusState = c =>
  withScreenFocusStateProvider(withScreenFocusState(c));

const selector = () => ({});

export default addFocusState(addStyle(connect(selector)(WelcomeScreen)));
