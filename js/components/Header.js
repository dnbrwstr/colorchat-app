import React, { Component } from "react";
import { View, Text, PixelRatio, StyleSheet } from "react-native";
import Style from "../style";
import PressableView from "./PressableView";
import { connectWithStyles } from "../lib/withStyles";
import SliderIcon from "./SliderIcon";
import { navigateTo } from "../actions/NavigationActions";

class Header extends Component {
  static defaultProps = {
    onBack: () => {},
    onClose: () => {}
  };

  render() {
    const { styles, theme } = this.props;

    let barStyles = [
      styles.bar,
      this.props.borderColor && {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: this.props.borderColor
      }
    ];

    let bgColor = this.props.backgroundColor && {
      backgroundColor: this.props.backgroundColor
    };

    let bgOpacity = typeof this.props.backgroundOpacity === "number" && {
      opacity: this.props.backgroundOpacity
    };

    let bgStyles = [styles.background, bgColor, bgOpacity];

    let textColor = this.props.color && {
      color: this.props.color
    };

    let titleTextColor = this.props.titleColor && {
      color: this.props.titleColor
    };

    let highlightColor = this.props.highlightColor && {
      backgroundColor: this.props.highlightColor
    };

    return (
      <View style={barStyles}>
        <View style={bgStyles} />

        <View style={styles.buttonContainer}>
          {this.props.showBack && (
            <PressableView
              onPress={this.onBack}
              style={styles.button}
              activeStyle={[styles.buttonActive, highlightColor]}
            >
              <Text style={[styles.buttonText, textColor]}>Back</Text>
            </PressableView>
          )}
        </View>

        <View style={styles.title}>
          {this.props.title && (
            <Text style={[styles.titleText, textColor, titleTextColor]}>
              {this.props.title}
            </Text>
          )}
        </View>

        <View style={[styles.buttonContainer, styles.rightButtonContainer]}>
          {this.props.showSettingsButton && (
            <PressableView
              onPress={this.handlePressSettings}
              style={styles.button}
              activeStyle={[styles.buttonActive, highlightColor]}
            >
              <SliderIcon
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 15,
                  marginLeft: 15
                }}
                strokeWidth={3}
                strokeColor={theme.primaryTextColor}
              />
            </PressableView>
          )}
        </View>
      </View>
    );
  }

  onBack = () => {
    this.props.onBack();
  };

  handlePressSettings = () => {
    this.props.dispatch(navigateTo("settings"));
  };
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
    ...Style.mixins.textBase,
    color: theme.primaryTextColor,
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
  buttonText: {
    ...Style.mixins.textBase,
    color: theme.primaryTextColor
  },
  buttonSecondText: {
    textAlign: "right"
  }
});

export default connectWithStyles(getStyles, () => ({}))(Header);
