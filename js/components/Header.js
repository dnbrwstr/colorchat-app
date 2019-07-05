import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Style from "../style";
import PressableView from "./PressableView";
import { connectWithStyles } from "../lib/withStyles";
import Text from "./BaseText";

class Header extends Component {
  static defaultProps = {
    showBorder: true
  };

  render() {
    const { styles, showBorder } = this.props;

    const barStyles = [styles.bar, showBorder && styles.borderBar];

    return (
      <View style={barStyles}>
        <View style={styles.background} />

        <View style={styles.buttonContainer}>
          {this.props.onPressBack && (
            <PressableView
              onPress={this.props.onPressBack}
              style={styles.button}
              activeStyle={[styles.buttonActive]}
            >
              <Text style={[styles.buttonText]}>Back</Text>
            </PressableView>
          )}
        </View>

        <View style={styles.title}>
          {this.props.renderTitle ? (
            this.props.renderTitle()
          ) : (
            <Text style={styles.titleText}>{this.props.title}</Text>
          )}
        </View>

        <View style={[styles.buttonContainer, styles.rightButtonContainer]}>
          {this.props.onPressSettings && (
            <PressableView
              onPress={this.props.onPressSettings}
              style={styles.button}
              activeStyle={styles.buttonActive}
            >
              {this.props.renderSettingsButton ? (
                this.props.renderSettingsButton()
              ) : (
                <Text style={[styles.buttonText]}>Settings</Text>
              )}
            </PressableView>
          )}
        </View>
      </View>
    );
  }
}

const getStyles = theme => ({
  bar: {
    height: Style.values.rowHeight,
    alignItems: "stretch",
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 0,
    backgroundColor: "transparent"
  },
  borderBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.secondaryBorderColor
  },
  background: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  title: {
    flex: 1,
    justifyContent: "center"
  },
  titleText: {
    textAlign: "center"
  },
  buttonContainer: {
    width: 80,
    alignItems: "flex-start"
  },
  rightButtonContainer: {
    alignItems: "flex-end"
  },
  button: {
    justifyContent: "center",
    paddingHorizontal: Style.values.outerPadding,
    height: "100%"
  },
  buttonActive: {
    backgroundColor: theme.highlightColor
  },
  buttonText: {},
  buttonSecondText: {
    textAlign: "right"
  }
});

export default connectWithStyles(getStyles, () => ({}))(Header);
