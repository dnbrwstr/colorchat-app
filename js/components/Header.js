import React, { Component } from "react";
import { View, Text, PixelRatio, StyleSheet } from "react-native";
import Style from "../style";
import PressableView from "./PressableView";
import withStyles from "../lib/withStyles";

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

        <View style={styles.buttonContainer}>
          {this.props.showClose && (
            <PressableView
              onPress={this.onClose}
              style={styles.button}
              activeStyle={[styles.buttonActive, highlightColor]}
            >
              <Text
                style={[styles.buttonText, styles.buttonSecondText, textColor]}
              >
                X
              </Text>
            </PressableView>
          )}
        </View>
      </View>
    );
  }

  onBack = () => {
    this.props.onBack();
  };

  onClose = () => {
    this.props.onClose();
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
  button: {
    justifyContent: "center",
    paddingHorizontal: 15,
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

export default withStyles(getStyles)(Header);
