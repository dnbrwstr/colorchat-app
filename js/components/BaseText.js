import PropTypes from "prop-types";
import React from "react";
import { Text, Animated } from "react-native";
import Color from "color";
import Style from "../style";
import withStyles from "../lib/withStyles";

/**
 * General purpose wrapper for Text element
 * Applies default styling & optionally adjusts color
 * to be visible on a given background
 */
class BaseText extends React.Component {
  static propTypes = {
    /**
     * Background color on which text will appear
     * If set, text color will be adjusted to ensure visibility
     */
    visibleOn: PropTypes.string
  };

  render() {
    return <Animated.Text {...this.props} style={this.getStyles()} />;
  }

  getStyles = () => {
    return [
      this.props.styles.text,
      this.props.visibleOn && { color: this.getColor() },
      this.props.style
    ];
  };

  getColor = () => {
    return Color(this.props.visibleOn).luminosity() > 0.5 ? "black" : "white";
  };
}

const addStyle = theme => ({
  text: {
    ...Style.mixins.textBase,
    color: theme.primaryTextColor
  }
});

export default withStyles(addStyle)(BaseText);
