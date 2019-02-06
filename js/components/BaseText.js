import PropTypes from "prop-types";
import React from "react";
import { Text } from "react-native";
import Color from "color";
import Style from "../style";

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
    return <Text {...this.props} style={this.getStyles()} />;
  }

  getStyles = () => {
    return [
      style.text,
      this.props.visibleOn && { color: this.getColor() },
      this.props.style
    ];
  };

  getColor = () => {
    return Color(this.props.visibleOn).luminosity() > 0.5 ? "black" : "white";
  };
}

let style = Style.create({
  text: {
    mixins: [Style.mixins.textBase]
  }
});

export default BaseText;
